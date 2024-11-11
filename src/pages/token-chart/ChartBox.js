import MainCard from 'components/MainCard';
import Switch from '@mui/material/Switch';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';

import BaseLineChart from './BaseLineChart';
import BasicVolumeChart from './BasicVolumeChart';
import RatioChart from './RatioChart';
import PBVChart from './PBVChart';
import AvgCostChart from './AvgCostChart';
import { useState, useEffect } from 'react';

import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { getTokenPrice,getTokenInfo } from 'data-server';
import { getChartData } from 'data-server/chart';
import { useParams } from 'react-router-dom';
import { set } from 'lodash';
import StackAreaChart from './StackAreaChart';
const parsePriceToKlineSeries = (data) => {
  return data.map((item) => {
    return [item.open, item.close, item.low, item.high];
  });
};

const formatToDateTimeString = (date) => {
  return date ? date.format('YYYY-MM-DD HH:mm:ss') : '';
};
function isSwingRatioChart(chart) {
  const items = ['avgcost_ratio'];
  return items.includes(chart);
}
function isStackAreaChart(chart) {
  const items = ['stack_balance_ratio'];
}

function isBaseLineChart(chart) {
  return !isAvgCostChart(chart)
   && !isBasicVolumeChart(chart)
    && !isPriceByVolumeChart(chart)
    && !isSwingRatioChart(chart) 
    && !isStackAreaChart(chart);
}
function isAvgCostChart(chart) {
  // const items = ['AvgCost', 'DexAvgCost', 'CexAvgCost', 'AvgCostExcept'];

  // return items.includes(chart);
  return chart.includes('AvgCost') || chart.includes('avg_cost');
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

  // const [startTime, setStartTime] = useState(dayjs('2021-01-01T00:00:00'));
  // const [endTime, setEndTime] = useState(dayjs()); // current time
  const [timeRange, setTimeRange] = useState({
    startTime: dayjs(),
    endTime: dayjs()
  });

  const { tokenItem } = useSelector((state) => state.token);
  const [chartData, setChartData] = useState([]);
  const [priceData, setPriceData] = useState([]);
  const { drawerOpen, openItem } = useSelector((state) => state.menu);
  const chartId = openItem ? openItem[0] : null;
  const { symbol } = useParams();
  const [chartDataList, setChartDataList] = useState([]);


  useEffect(() => {
    getTokenInfo(symbol).then((response) => {
      if (response?.create_time) {
        let start = response.create_time.split(' ')[0] + ' 00:00:00';
        let startTime = dayjs(start);
        setTimeRange((prev) => ({ ...prev, startTime }));
      }
    });
  }, [symbol]);

  useEffect(() => {
    try {
      if (isStackAreaChart(chartId)) {
        getChartData({
          token_symbol: symbol,
          chart_label: 'wallet_balance_by_day_before_ratio',
          start_time: '2024-01-01 00:00:00',
          end_time: formatToDateTimeString(timeRange.endTime)
        }).then((response) => {
          setChartDataList(response ? response : []);
      });
        getChartData({
          token_symbol: symbol,
          chart_label: 'wallet_balance_by_day_after_ratio',
          start_time: formatToDateTimeString(timeRange.startTime),
          end_time: formatToDateTimeString(timeRange.endTime)
        }).then((response) => {
          setChartDataList((pre) => [...pre, response ? response : []]);
        });
      }else{
          getChartData({
            token_symbol: symbol,
            chart_label: chartId,
            start_time: formatToDateTimeString(timeRange.startTime),
            end_time: formatToDateTimeString(timeRange.endTime)
          }).then((response) => {
            setChartData(response ? response : []);
        });
      }

      getTokenPrice({
        token_symbol: symbol,
        start_time: formatToDateTimeString(timeRange.startTime),
        end_time: formatToDateTimeString(timeRange.endTime)
      }).then((response) => {
        setPriceData(response ? response : []);
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      setChartData([]);
      setPriceData([]);
    }}, [chartId, symbol, timeRange]);

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
          smooth: true,
          symbol: 'none'
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
          smooth: true,
          symbol: 'none'
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
      {isSwingRatioChart(chartId) && (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div>
            <DateTimePicker
              label="Start Time"
              value={timeRange.startTime}
              onChange={(newValue) => setStartTime(newValue)}
              renderInput={(params) => <TextField {...params} />}
            />
            <DateTimePicker
              label="End Time"
              value={timeRange.endTime}
              onChange={(newValue) => setEndTime(newValue)}
              renderInput={(params) => <TextField {...params} />}
            />
            <RatioChart chartName={chartId} chartData={chartData} priceSeries={priceSeries} priceData={priceData} />
          </div>
        </LocalizationProvider>
      )}
      {isBaseLineChart(chartId) && (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div>
          <DateTimePicker
            label="Start Time"
            value={timeRange.startTime}
            onChange={(newValue) => setStartTime(newValue)}
            renderInput={(params) => <TextField {...params} />}
          />
          <DateTimePicker
            label="End Time"
            value={timeRange.endTime}
            onChange={(newValue) => setEndTime(newValue)}
            renderInput={(params) => <TextField {...params} />}
          />
        <BaseLineChart chartName={chartId} chartData={chartData} priceSeries={priceSeries} priceData={priceData} />
        </div>
        </LocalizationProvider>
      )}
      {isAvgCostChart(chartId) && (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div>
            <DateTimePicker
              label="Start Time"
              value={timeRange.startTime}
              onChange={(newValue) => setStartTime(newValue)}
              renderInput={(params) => <TextField {...params} />}
            />
            <DateTimePicker
              label="End Time"
              value={timeRange.endTime}
              onChange={(newValue) => setEndTime(newValue)}
              renderInput={(params) => <TextField {...params} />}
            />
            <AvgCostChart chartName={chartId} chartData={chartData} priceSeries={priceSeries} priceData={priceData} />
          </div>
        </LocalizationProvider>
      )}
      {isBasicVolumeChart(chartId) && <BasicVolumeChart chartName={chartId} chartData={chartData} priceSeries={priceSeries} />}
      {isPriceByVolumeChart(chartId) && (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div>
            <DateTimePicker
              label="Start Time"
              value={timeRange.startTime}
              onChange={(newValue) => setStartTime(newValue)}
              renderInput={(params) => <TextField {...params} />}
            />
            <DateTimePicker
              label="End Time"
              value={timeRange.endTime}
              onChange={(newValue) => setEndTime(newValue)}
              renderInput={(params) => <TextField {...params} />}
            />
            <PBVChart chartName={chartId} chartData={chartData} priceSeries={priceSeries} priceData={priceData} />
          </div>
        </LocalizationProvider>
      )}
      {isStackAreaChart(chartId) && (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div>
          <DateTimePicker
            label="Start Time"
            value={timeRange.startTime}
            onChange={(newValue) => setStartTime(newValue)}
            renderInput={(params) => <TextField {...params} />}
          />
          <DateTimePicker
            label="End Time"
            value={timeRange.endTime}
            onChange={(newValue) => setEndTime(newValue)}
            renderInput={(params) => <TextField {...params} />}
          />
          <StackAreaChart chartName={chartId} chartDataList={chartDataList} priceSeries={priceSeries} priceData={priceData} />
        </div>
      </LocalizationProvider>
      )}
    </MainCard>
  );
};
export default ChartBox;
