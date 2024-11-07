import { useState, useEffect, useMemo, useCallback } from 'react';
import { Box, FormControlLabel, TextField, FormGroup, Checkbox, Autocomplete, Button, Divider } from '@mui/material';
import { Switch } from '@mui/material';
import { SettingsIcon } from '@mui/icons-material';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

import MainChart from './MainChart';
import MainCard from 'components/MainCard';
import TokenInfo from './TokenInfo';
import { getTokenPrice, getChartData, getTokenInfo } from 'data-server/common';

// Constants
const INDICATOR_OPTIONS = [
  'Trade_usd_volume',
  'Tx_usd_volume',
  'Trade_token_volume',
  'Tx_token_volume',
  'Wallet_cost_usd_pbv',
  'FirstDayWallets_token_PBV'
];

// Utility functions moved outside component
const formatToDateTimeString = (date) => date?.format('YYYY-MM-DD HH:mm:ss') || '';

const parsePriceToKlineSeries = (data) => data.map(({ open, close, low, high }) => [open, close, low, high]);

const calculateMA = (data, dayCount) => {
  return data.map((_, index) => {
    if (index < dayCount - 1) return null;
    const sum = data.slice(index - dayCount + 1, index + 1).reduce((acc, val) => acc + val, 0);
    return sum / dayCount;
  });
};

const getPBVData = (response, type) => {
  const typeMap = {
    total_Trade_usd_volume: 'total_trade_usd_volume',
    total_Tx_usd_volume: 'total_tx_usd_volume',
    total_Tx_token_volume: 'total_tx_token_volume',
    total_Trade_token_volume: 'total_trade_token_volume',
    positive_Trade_token_volume: 'positive_trade_token_volume',
    negative_Trade_token_volume: 'negative_trade_token_volume',
    positive_Trade_usd_volume: 'positive_trade_usd_volume',
    negative_Trade_usd_volume: 'negative_trade_usd_volume'
  };

  return response.map((item) => item[typeMap[type]]);
};

const ChartBox = ({ symbol }) => {
  // State management
  const [chartState, setChartState] = useState({
    priceLineType: 'candlestick',
    showMa7: false,
    showMa30: false,
    showAvgCost: true,
    showVolume: true,
    volumeType: 'usd_volume',
    pbvType: '',
    stackPosAndNeg: true
  });

  const [timeRange, setTimeRange] = useState({
    startTime: null,
    endTime: dayjs()
  });

  const [chartData, setChartData] = useState({
    tokenInfo: {},
    priceData: [],
    avgCostData: [],
    volumeData: [],
    pbvData: []
  });

  // Fetch token info and set initial start time
  useEffect(() => {
    const fetchTokenInfo = async () => {
      const response = await getTokenInfo(symbol);
      setChartData((prev) => ({ ...prev, tokenInfo: response }));
      if (response?.create_time) {
        const startTime = dayjs(response.create_time.split(' ')[0] + ' 00:00:00');
        setTimeRange((prev) => ({ ...prev, startTime }));
      }
    };
    fetchTokenInfo();
  }, [symbol]);

  // Combined data fetching effect
  useEffect(() => {
    const fetchChartData = async () => {
      const { startTime, endTime } = timeRange;
      if (!startTime || !endTime) return;

      const params = {
        token_symbol: symbol,
        start_time: formatToDateTimeString(startTime),
        end_time: formatToDateTimeString(endTime)
      };

      try {
        const [priceData, avgCostData, volumeData] = await Promise.all([
          getTokenPrice(params),
          chartState.showAvgCost ? getChartData({ ...params, chart_label: 'AvgCost' }) : [],
          chartState.showVolume ? getChartData({ ...params, chart_label: 'TradeTokenVolume' }) : []
        ]);

        setChartData((prev) => ({
          ...prev,
          priceData: priceData || [],
          avgCostData: avgCostData || [],
          volumeData: volumeData || []
        }));
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

    fetchChartData();
  }, [symbol, timeRange, chartState.showAvgCost, chartState.showVolume]);

  // Memoized series calculations
  const priceSeries = useMemo(() => {
    const { priceData } = chartData;
    const { priceLineType } = chartState;

    const baseSeries = {
      name: 'AvgPrice',
      type: 'line',
      yAxisIndex: 0,
      symbol: 'none',
      data: priceData.map((item) => item.avg_price),
      smooth: true
    };

    if (priceLineType === 'line') return [baseSeries];

    return [
      baseSeries,
      {
        name: 'Price',
        type: 'candlestick',
        data: parsePriceToKlineSeries(priceData),
        yAxisIndex: 0,
        itemStyle: {
          color0: '#ef232a',
          color: '#14b143',
          borderColor0: '#ef232a',
          borderColor: '#14b143'
        }
      }
    ];
  }, [chartData.priceData, chartState.priceLineType]);

  const movingAverages = useMemo(() => {
    const { priceData } = chartData;
    const { showMa7, showMa30 } = chartState;
    const avgPrices = priceData.map((item) => item.avg_price);

    return [
      showMa7 && {
        name: 'MA7',
        type: 'line',
        data: calculateMA(avgPrices, 7),
        smooth: true,
        yAxisIndex: 0,
        symbol: 'none',
        lineStyle: { color: 'rgb(255, 140, 0)' }
      },
      showMa30 && {
        name: 'MA30',
        type: 'line',
        data: calculateMA(avgPrices, 30),
        smooth: true,
        yAxisIndex: 0,
        symbol: 'none',
        lineStyle: { color: 'rgb(255, 0, 0)' }
      }
    ].filter(Boolean);
  }, [chartData.priceData, chartState.showMa7, chartState.showMa30]);

  // Event handlers
  const handleStateChange = useCallback((key, value) => {
    setChartState((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleTimeChange = useCallback((key, value) => {
    setTimeRange((prev) => ({ ...prev, [key]: value }));
  }, []);

  // Render helper components
  const renderControls = () => (
    <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mt: 1, height: '30px' }}>
      <FormGroup row>
        <FormControlLabel
          control={
            <Checkbox
              checked={chartState.showAvgCost}
              onChange={(e) => handleStateChange('showAvgCost', e.target.checked)}
              sx={{ '& .MuiSvgIcon-root': { fontSize: 16 } }}
            />
          }
          label={<span style={{ fontSize: '14px' }}>AvgCost</span>}
        />
        {/* Add other controls... */}
      </FormGroup>

      <Autocomplete
        sx={{ width: 300 }}
        options={INDICATOR_OPTIONS}
        onChange={(_, newValue) => handleStateChange('pbvType', newValue)}
        renderInput={(params) => <TextField {...params} label="Indicator" size="small" />}
      />
    </Box>
  );

  return (
    <MainCard sx={{ mt: 0, p: 0 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <TokenInfo symbol={symbol} />
      </Box>
      <Divider />

      {renderControls()}
      <Divider />

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box sx={{ mt: 1 }}>
          <DateTimePicker label="Start Time" value={timeRange.startTime} onChange={(value) => handleTimeChange('startTime', value)} />
          <DateTimePicker label="End Time" value={timeRange.endTime} onChange={(value) => handleTimeChange('endTime', value)} />

          <MainChart
            chartName={symbol}
            chartData={chartData.volumeData}
            // yAxisSeries={}
            dataSeries={[...priceSeries, ...movingAverages]}
            priceData={chartData.priceData}
          />
        </Box>
      </LocalizationProvider>
    </MainCard>
  );
};

export default ChartBox;
