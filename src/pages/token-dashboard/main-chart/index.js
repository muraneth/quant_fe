import { useState, useEffect } from 'react';

import Switch from '@mui/material/Switch';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import Autocomplete from '@mui/material/Autocomplete';

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
  const [priceLineType, setPriceLineType] = useState('candlestick');
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
  const [pbvType, setPbvType] = useState('');
  const [walletPbvData, setWalletPbvData] = useState([]);
  const [stackPosAndNeg, setStackPosAndNeg] = useState(true);

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

  const getPBVData = (response, type) => {
    return response.map((item) => {
      if (type === 'total_trade_usd_volume') {
        return item.total_trade_usd_volume;
      } else if (type === 'total_tx_usd_volume') {
        return item.total_tx_usd_volume;
      } else if (type === 'total_trade_token_volume') {
        return item.total_trade_token_volume;
      } else if (type === 'total_tx_token_volume') {
        return item.total_tx_token_volume;
      } else if (type === 'positive_trade_token_volume') {
        return item.positive_trade_token_volume;
      } else if (type === 'negative_trade_token_volume') {
        return item.negative_trade_token_volume;
      } else if (type === 'positive_trade_usd_volume') {
        return item.positive_trade_usd_volume;
      } else if (type === 'negative_trade_usd_volume') {
        return item.negative_trade_usd_volume;
      }
      // else if (type === 'wallet_cost_usd_pbv') {
      //   return item.wallet_cost_usd_pbv;
      // }
    });
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
              yAxisIndex: 0,
              areaStyle: {
                color: 'rgba(0, 123, 255, 0.2)' // Adjust the RGB and opacity as needed
              },
              lineStyle: {
                color: 'rgb(0, 123, 255)' // Optionally, set the line color
              }
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
              stack: 'Volume',
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
              stack: 'Volume',
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
    if (pbvType) {
      getChartData({
        token_symbol: symbol,
        chart_label: 'PriceByVolumeTimeRange',
        start_time: formatToDateTimeString(startTime),
        end_time: formatToDateTimeString(endTime)
      }).then((response) => {
        setPbvData(response ? response : []);
        if (response?.length > 0) {
          if (stackPosAndNeg) {
            setPbvSeries([
              {
                name: 'Positive PBV',
                type: 'bar',
                stack: 'pbvVolume',
                data: getPBVData(response, `positive_${pbvType}`),
                yAxisIndex: 2,
                xAxisIndex: 2,
                itemStyle: {
                  color: 'rgba(144, 238, 144, 0.5)' // Light blue with 50% transparency
                }
              },
              {
                name: 'Negative PBV',
                type: 'bar',
                stack: 'pbvVolume',
                data: getPBVData(response, `negative_${pbvType}`),
                yAxisIndex: 2,
                xAxisIndex: 2,
                itemStyle: {
                  color: ' rgba(255, 111, 97, 0.5)' // Light red with 50% transparency
                }
              }
            ]);
          } else {
            setPbvSeries([
              {
                name: 'PriceByVolume',
                type: 'bar',
                data: getPBVData(response, pbvType),
                barWidth: '40%',
                yAxisIndex: 2,
                xAxisIndex: 2,
                itemStyle: {
                  color: 'rgba(115, 192, 222, 0.5)' // Light blue with 50% transparency
                }
              }
            ]);
          }
        }
      });
    } else {
      setPbvSeries([]);
    }
  }, [symbol, pbvType, startTime, endTime, stackPosAndNeg]);

  useEffect(() => {
    try {
      getTokenPrice({
        token_symbol: symbol,
        start_time: formatToDateTimeString(startTime),
        end_time: formatToDateTimeString(endTime)
      }).then((response) => {
        setPriceData(response ? response : []);
      });
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
        data: priceData.map((item) => item.avg_price),
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
    setCombinedSeries([...priceSeries, ...avgCostSeries, ...volumeSeries, ...pbvSeries]);
  }, [priceSeries, avgCostSeries, volumeSeries, pbvSeries]);

  return (
    <MainCard sx={{ mt: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <FormGroup row>
          <FormControlLabel control={<Checkbox defaultChecked onChange={onAvgCostChange} />} label="AvgCost" />
          <FormControlLabel control={<Checkbox defaultChecked onChange={onVolumeChange} />} label="Volume" />
          {/* <FormControlLabel control={<Checkbox defaultChecked onChange={onPbvChange} />} label="PBV(usd)" />
          <FormControlLabel control={<Checkbox defaultChecked onChange={onPbvChange} />} label="PBV(token)" /> */}
          <Autocomplete
            disablePortal
            options={['trade_usd_volume', 'tx_usd_volume', 'trade_token_volume', 'tx_token_volume', 'wallet_cost_usd_pbv']}
            sx={{ width: 300 }}
            onChange={(event, newValue) => {
              setPbvType(newValue);
            }}
            renderInput={(params) => <TextField {...params} label="PBV" />}
          />
          {/* <FormControlLabel control={<Checkbox defaultChecked={false} onChange={onWalletPbvChange} />} label="Wallet PBV" /> */}
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
