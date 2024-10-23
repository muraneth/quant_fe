import { useState, useEffect } from 'react';

import Switch from '@mui/material/Switch';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';

import MainChart from './MainChart';
import MainCard from 'components/MainCard';

import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { getTokenPrice } from 'server/common';
import { getChartData } from 'server/chart';
import { Divider } from '@mui/material';

const parsePriceToKlineSeries = (data) => {
  return data.map((item) => {
    return [item.open, item.close, item.low, item.high];
  });
};

const formatToDateTimeString = (date) => {
  return date ? date.format('YYYY-MM-DD HH:mm:ss') : '';
};

// kline , ma5, ma10, ma20, ma30, ma60, ma120, ma250
// avgcost, longTermAvgCost, shortTermAvgCost
// volume
// pbv
//wallet balance by cost

const ChartBox = ({ symbol }) => {
  const [priceLineType, setPriceLineType] = useState('line');
  const [priceSeries, setPriceSeries] = useState([]);
  const [startTime, setStartTime] = useState(dayjs('2021-01-01T00:00:00'));
  const [endTime, setEndTime] = useState(dayjs()); // current time

  const [showAvgCost, setShowAvgCost] = useState(false);
  const [showVolume, setShowVolume] = useState(false);
  const [showPbv, setShowPbv] = useState(false);
  const [showWalletPbv, setShowWalletPbv] = useState(false);

  const [priceData, setPriceData] = useState([]);
  const [avgCostData, setAvgCostData] = useState([]);
  const [volumeData, setVolumeData] = useState([]);
  const [pbvData, setPbvData] = useState([]);
  const [walletPbvData, setWalletPbvData] = useState([]);

  useEffect(() => {
    try {
      getTokenPrice({
        token_symbol: tokenItem.symbol,
        start_time: formatToDateTimeString(startTime),
        end_time: formatToDateTimeString(endTime)
      }).then((response) => {
        setPriceData(response ? response : []);
      });
      getChartData({
        token_symbol: symbol,
        chart_label: 'AvgCost',
        start_time: formatToDateTimeString(startTime),
        end_time: formatToDateTimeString(endTime)
      }).then((response) => {
        setAvgCostData(response ? response : []);
      });
      getChartData({
        token_symbol: symbol,
        chart_label: 'TradeVolume',
        start_time: formatToDateTimeString(startTime),
        end_time: formatToDateTimeString(endTime)
      }).then((response) => {
        setVolumeData(response ? response : []);
      });
      getChartData({
        token_symbol: symbol,
        chart_label: 'PriceByVolumeTimeRange',
        start_time: formatToDateTimeString(startTime),
        end_time: formatToDateTimeString(endTime)
      }).then((response) => {
        setPbvData(response ? response : []);
      });
      getChartData({
        token_symbol: symbol,
        chart_label: 'WalletPriceByVolume',
        start_time: formatToDateTimeString(startTime),
        end_time: formatToDateTimeString(endTime)
      }).then((response) => {
        setWalletPbvData(response ? response : []);
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [symbol]);

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
          data: priceData.map((item) => item.price),
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
          data: priceData.map((item) => item.price),
          smooth: true
        }
      ];
      setPriceSeries(series);
    }
  }, [priceLineType, priceData]);

  return (
    <MainCard sx={{ mt: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        {/* <Typography variant="h6" gutterBottom>
          {symbol}
        </Typography> */}
        <FormGroup row>
          <FormControlLabel control={<Checkbox defaultChecked />} label="Volume" />
          <FormControlLabel control={<Checkbox defaultChecked />} label="Required" />
          <FormControlLabel control={<Checkbox defaultChecked />} label="Disabled" />
        </FormGroup>
        <FormControlLabel control={<Switch onChange={switchKlineType} />} label="Kline" />
      </Box>
      <Divider />

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box sx={{ mt: 1 }}>
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
          <MainChart chartName={symbol} chartData={pbvData} priceSeries={priceSeries} priceData={priceData} />
        </Box>
      </LocalizationProvider>
    </MainCard>
  );
};
export default ChartBox;
