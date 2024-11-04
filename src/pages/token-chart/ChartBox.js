import MainCard from 'components/MainCard';
import Switch from '@mui/material/Switch';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';

import BaseLineChart from './BaseLineChart';
import BasicVolumeChart from './BasicVolumeChart';
import PBVChart from './PBVChart';
import AvgCostChart from './AvgCostChart';
import { useState, useEffect } from 'react';

import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { getTokenPrice } from 'server/common';
import { getChartData } from 'server/chart';
import {useParams} from 'react-router-dom';
const parsePriceToKlineSeries = (data) => {
  return data.map((item) => {
    return [item.open, item.close, item.low, item.high];
  });
};

const formatToDateTimeString = (date) => {
  return date ? date.format('YYYY-MM-DD HH:mm:ss') : '';
};

function isBaseLineChart(chart) {
  return !isAvgCostChart(chart) && !isBasicVolumeChart(chart) && !isPriceByVolumeChart(chart);
}
function isAvgCostChart(chart) {
  // const items = ['AvgCost', 'DexAvgCost', 'CexAvgCost', 'AvgCostExcept'];
  
  // return items.includes(chart);
  return chart.includes("AvgCost")
}
function isBasicVolumeChart(chart) {
  const items = [
    'TradeVolume',
    'DailyTradeVolumeUSD',
    'DailyTxVolume',
    'USDPnNVolume',
    'PnNVolume',
    'RobotVolume',
    'TradingVolumeWithoutBot'
  ];
  return items.includes(chart);
}
function isPriceByVolumeChart(chart) {
  const items = ['PriceByVolumeTimeRange', 'WalletPriceByVolume'];
  return items.includes(chart);
}

const ChartBox = () => {
  const [priceLineType, setPriceLineType] = useState('line');
  const [priceSeries, setPriceSeries] = useState([]);

  const [startTime, setStartTime] = useState(dayjs('2021-01-01T00:00:00'));
  const [endTime, setEndTime] = useState(dayjs()); // current time

  const { tokenItem } = useSelector((state) => state.token);
  const [chartData, setChartData] = useState([]);
  const [priceData, setPriceData] = useState([]);
  const { drawerOpen, openItem } = useSelector((state) => state.menu);
  const chartId = openItem ? openItem[0] : null;
  const { symbol } = useParams();
  useEffect(() => {
    try {
      getChartData({
        token_symbol: symbol,
        chart_label: chartId,
        start_time: formatToDateTimeString(startTime),
        end_time: formatToDateTimeString(endTime)
      }).then((response) => {
        setChartData(response ? response : []);
      });
      getTokenPrice({
        token_symbol: symbol,
        start_time: formatToDateTimeString(startTime),
        end_time: formatToDateTimeString(endTime)
      }).then((response) => {
        setPriceData(response ? response : []);
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      setChartData([]);
      setPriceData([]);
    }
  }, [chartId]);

  const switchKlineType = () => {
    setPriceLineType((prev) => (prev === 'line' ? 'candlestick' : 'line'));
  };
  useEffect(() => {
    if (priceLineType === 'candlestick') {
      const series = [
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
        },
        {
          name: 'Price',
          type: 'line',
          yAxisIndex: 0,
          data: priceData.map((item) => item.avg_price),
          smooth: true
        }
      ];
      setPriceSeries(series);
    } else {
      const series = [
        {
          name: 'Price',
          type: 'line',
          yAxisIndex: 0,
          data: priceData.map((item) => item.avg_price),
          smooth: true
        }
      ];
      setPriceSeries(series);
    }
  }, [priceLineType, priceData]);

  return (
    <MainCard>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" gutterBottom>
          {chartId}
        </Typography>
        <FormControlLabel control={<Switch onChange={switchKlineType} />} label="Kline" />
      </Box>
      {isBaseLineChart(chartId) && <BaseLineChart chartName={chartId} chartData={chartData} priceSeries={priceSeries} priceData={priceData} />}
      {isAvgCostChart(chartId) && <AvgCostChart chartName={chartId} chartData={chartData} priceSeries={priceSeries} priceData={priceData}/>}
      {isBasicVolumeChart(chartId) && <BasicVolumeChart chartName={chartId} chartData={chartData} priceSeries={priceSeries} />}
      {isPriceByVolumeChart(chartId) && (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div>
            <DateTimePicker
              label="Start Time"
              value={startTime}
              onChange={(newValue) => setStartTime(newValue)}
              renderInput={(params) => <TextField {...params} />}
            />
            <DateTimePicker
              label="End Time"
              value={endTime}
              onChange={(newValue) => setEndTime(newValue)}
              renderInput={(params) => <TextField {...params} />}
            />
            <PBVChart chartName={chartId} chartData={chartData} priceSeries={priceSeries} priceData={priceData} />
          </div>
        </LocalizationProvider>
      )}
    </MainCard>
  );
};
export default ChartBox;
