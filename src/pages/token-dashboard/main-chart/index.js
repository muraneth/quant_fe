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
import { set } from 'lodash';

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
  const [avgCostSeries, setAvgCostSeries] = useState([]);
  const [volumeSeries, setVolumeSeries] = useState([]);
  const [pbvSeries, setPbvSeries] = useState([]);

  const [combinedSeries, setCombinedSeries] = useState([]);

  const [startTime, setStartTime] = useState(dayjs('2021-01-01T00:00:00'));
  const [endTime, setEndTime] = useState(dayjs()); // current time

  const [showAvgCost, setShowAvgCost] = useState(true);
  const [showVolume, setShowVolume] = useState(true);
  const [showPbv, setShowPbv] = useState(true);
  const [showWalletPbv, setShowWalletPbv] = useState(false);

  const [priceData, setPriceData] = useState([]);

  const [avgCostData, setAvgCostData] = useState([]);
  const [volumeData, setVolumeData] = useState([]);
  const [pbvData, setPbvData] = useState([]);
  const [walletPbvData, setWalletPbvData] = useState([]);

  const onAvgCostChange = (event) => {
    setShowAvgCost(event.target.checked);
  };
  const onVolumeChange = (event) => {
    setShowVolume(event.target.checked);
  };
  const onPbvChange = (event) => {
    setShowPbv(event.target.checked);
  };
  const onWalletPbvChange = (event) => {
    setShowWalletPbv(event.target.checked);
  };

  useEffect(() => {
    if (showAvgCost) {
      getChartData({
        token_symbol: symbol,
        chart_label: 'AvgCost',
        start_time: formatToDateTimeString(startTime),
        end_time: formatToDateTimeString(endTime)
      }).then((response) => {
        setAvgCostData(response ? response : []);
        if (response?.length > 0) {
          setAvgCostSeries([
            {
              name: 'AvgCost',
              type: 'line',
              data: response.map((item) => item.value),
              smooth: true,
              yAxisIndex: 0
            }
          ]);
        }
      });
    } else {
      setAvgCostSeries([]);
    }
  }, [symbol, showAvgCost, startTime, endTime]);

  useEffect(() => {
    if (showVolume) {
      getChartData({
        token_symbol: symbol,
        chart_label: 'TradeVolume',
        start_time: formatToDateTimeString(startTime),
        end_time: formatToDateTimeString(endTime)
      }).then((response) => {
        setVolumeData(response ? response : []);
        if (response?.length > 0) {
          setVolumeSeries([
            {
              name: 'Buy Volume',
              type: 'bar',
              data: response?.map((item) => item.buy_volume),
              yAxisIndex: 1,
              xAxisIndex: 1,
              itemStyle: {
                color: '#73C0DE'
              }
            },
            {
              name: 'Sell Volume',
              type: 'bar',
              data: response?.map((item) => item.sell_volume),
              yAxisIndex: 1,
              xAxisIndex: 1,
              itemStyle: {
                color: '#FF6F61'
              }
            }
          ]);
        }
      });
    } else {
      setVolumeSeries([]);
    }
  }, [symbol, showVolume, startTime, endTime]);
  useEffect(() => {
    if (showPbv) {
      getChartData({
        token_symbol: symbol,
        chart_label: 'PriceByVolumeTimeRange',
        start_time: formatToDateTimeString(startTime),
        end_time: formatToDateTimeString(endTime)
      }).then((response) => {
        setPbvData(response ? response : []);
      });
    }
  }, [symbol, showPbv, startTime, endTime]);

  useEffect(() => {
    try {
      getTokenPrice({
        token_symbol: symbol,
        start_time: formatToDateTimeString(startTime),
        end_time: formatToDateTimeString(endTime)
      }).then((response) => {
        setPriceData(response ? response : []);
      });

      if (showVolume) {
        getChartData({
          token_symbol: symbol,
          chart_label: 'TradeVolume',
          start_time: formatToDateTimeString(startTime),
          end_time: formatToDateTimeString(endTime)
        }).then((response) => {
          setVolumeData(response ? response : []);
        });
      }

      if (showPbv) {
        getChartData({
          token_symbol: symbol,
          chart_label: 'PriceByVolumeTimeRange',
          start_time: formatToDateTimeString(startTime),
          end_time: formatToDateTimeString(endTime)
        }).then((response) => {
          setPbvData(response ? response : []);
        });
      }
      if (showWalletPbv) {
        getChartData({
          token_symbol: symbol,
          chart_label: 'WalletPriceByVolume',
          start_time: formatToDateTimeString(startTime),
          end_time: formatToDateTimeString(endTime)
        }).then((response) => {
          setWalletPbvData(response ? response : []);
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [symbol, startTime, endTime]);

  const switchKlineType = () => {
    setPriceLineType((prev) => (prev === 'line' ? 'candlestick' : 'line'));
  };
  useEffect(() => {
    let priceSeries = [
      {
        name: 'AvgPrice',
        type: 'line',
        yAxisIndex: 0,
        data: priceData.map((item) => item.price),
        smooth: true
      }
    ];
    if (priceLineType === 'candlestick') {
      priceSeries.push({
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
      });
    }

    setPriceSeries(priceSeries);
  }, [priceLineType, priceData]);

  useEffect(() => {
    setCombinedSeries([...priceSeries, ...avgCostSeries, ...volumeSeries]);
  }, [priceSeries, avgCostSeries, volumeSeries]);

  return (
    <MainCard sx={{ mt: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <FormGroup row>
          <FormControlLabel control={<Checkbox defaultChecked onChange={onAvgCostChange} />} label="AvgCost" />
          <FormControlLabel control={<Checkbox defaultChecked onChange={onVolumeChange} />} label="Volume" />
          <FormControlLabel control={<Checkbox defaultChecked onChange={onPbvChange} />} label="PBV" />
          <FormControlLabel control={<Checkbox defaultChecked={false} onChange={onWalletPbvChange} />} label="Wallet PBV" />
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
          <MainChart chartName={symbol} chartData={volumeData} pbvData={pbvData} dataSeries={combinedSeries} priceData={priceData} />
        </Box>
      </LocalizationProvider>
    </MainCard>
  );
};
export default ChartBox;
