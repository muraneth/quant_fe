import { useState, useEffect } from 'react';

import Switch from '@mui/material/Switch';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button'
import SettingsIcon from '@mui/icons-material/Settings';
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
import TokenInf from './TokenInfo';

import { getTokenInfo } from 'server/tokenlist';
import { transform } from 'echarts';


const parsePriceToKlineSeries = (data) => {
  return data.map((item) => {
    return [item.open, item.close, item.low, item.high];
  });
};

const formatToDateTimeString = (date) => {
  return date ? date.format('YYYY-MM-DD HH:mm:ss') : '';
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
  const calculateMA = (data, dayCount) => {
    const result = [];
    for (let i = 0, len = data.length; i < len; i++) {
      if (i < dayCount - 1) {
        // Not enough data yet, push null or the current value
        result.push(null);
        continue;
      }
      let sum = 0;
      for (let j = 0; j < dayCount; j++) {
        sum += data[i - j];
      }
      result.push(sum / dayCount);
    }
    return result;
  };

const ChartBox = ({ symbol }) => {
  const [tokenInfo, setTokenInfo] = useState({});
  const [priceLineType, setPriceLineType] = useState('candlestick');
  const [priceSeries, setPriceSeries] = useState([]);
  const [ma7Series, setMa7Series] = useState([]);
  const [showMa7, setShowMa7] = useState(false);

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
  const onMa7Change =(event) =>{
    setShowMa7(event.target.checked);
  }

  useEffect(() => {
    getTokenInfo(symbol ).then((response) => {
        setTokenInfo(response);
        if (response?.create_time){
          let startTime = response.create_time.split(' ')[0]+" 00:00:00";
          setStartTime(dayjs(startTime));
        }
        });
  }, [symbol]);

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
              symbol: 'none',
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
        symbol: 'none',
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
    if (showMa7) {
      
      setMa7Series([
        {
          name: 'MA7',
          type: 'line',
          data: calculateMA(priceData.map((item) => item.avg_price), 7) ,
          smooth: true,
          yAxisIndex: 0,
          symbol: 'none',
          lineStyle: {
            color: 'rgb(255, 140, 0)' // Optionally, set the line color
          }
        }
      ]);
    } else {
      setMa7Series([]);
    }
  }, [priceData,showMa7]);

  useEffect(() => {
    setCombinedSeries([...priceSeries, ...avgCostSeries, ...volumeSeries, ...pbvSeries, ...ma7Series]);
  }, [priceSeries, avgCostSeries, volumeSeries, pbvSeries,ma7Series]);

  return (
    <MainCard sx={{ mt: 0, p:0 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
            <TokenInf symbol={symbol} />
        </Box>
        <Divider />
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{mt:1,height: '30px' }}>
        <FormGroup row>
          <FormControlLabel control={<Checkbox defaultChecked onChange={onAvgCostChange}  
           sx={{
        '& .MuiSvgIcon-root': {
          fontSize: 16, // Change the size of the checkbox icon (default is 24px)
        },
      }} />} label={<span style={{ fontSize: '14px' }}>AvgCost</span>} />
      <FormControlLabel control={<Checkbox defaultChecked onChange={onMa7Change}  
           sx={{
        '& .MuiSvgIcon-root': {
          fontSize: 16, // Change the size of the checkbox icon (default is 24px)
        },
      }} />} label={<span style={{ fontSize: '14px' }}>MA7</span>} />
          <Box sx={{ height: '48px', width: 300 }}>
            <Autocomplete
            sx={{ height: '48px' }} 
                disablePortal
                options={['trade_usd_volume', 'tx_usd_volume', 'trade_token_volume', 'tx_token_volume', 'wallet_cost_usd_pbv']}
                onChange={(event, newValue) => {
                setPbvType(newValue);
                }}
                renderInput={(params) => (
                <TextField {...params} label="Indicator" size="small"  /> 
                )}
            />
         </Box>

        </FormGroup>
        <Button>
            <SettingsIcon />
        </Button>
        
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
