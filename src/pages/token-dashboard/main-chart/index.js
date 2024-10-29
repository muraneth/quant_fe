import { useState, useEffect } from 'react';

import Switch from '@mui/material/Switch';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
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
import { transform, use } from 'echarts';
import { set } from 'lodash';

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
    if (type === 'total_Trade_usd_volume') {
      return item.total_trade_usd_volume;
    } else if (type === 'total_Tx_usd_volume') {
      return item.total_tx_usd_volume;
    } else if (type === 'total_Tx_token_volume') {
      return item.total_tx_token_volume;
    } else if (type === 'total_Trade_token_volume') {
      return item.total_trade_token_volume;
    } else if (type === 'positive_Trade_token_volume') {
      return item.positive_trade_token_volume;
    } else if (type === 'negative_Trade_token_volume') {
      return item.negative_trade_token_volume;
    } else if (type === 'positive_Trade_usd_volume') {
      return item.positive_trade_usd_volume;
    } else if (type === 'negative_Trade_usd_volume') {
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
  const [ma30Series, setMa30Series] = useState([]);
  const [showMa7, setShowMa7] = useState(false);
  const [showMa30, setShowMa30] = useState(false);

  const [avgCostSeries, setAvgCostSeries] = useState([]);
  const [volumeSeries, setVolumeSeries] = useState([]);
  const [pbvSeries, setPbvSeries] = useState([]);

  const [combinedSeries, setCombinedSeries] = useState([]);
  const [yAxisSeries, setYAxisSeries] = useState([]);

  const [startTime, setStartTime] = useState();
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
  const onMa7Change = (event) => {
    setShowMa7(event.target.checked);
  };
  const onMa30Change = (event) => {
    setShowMa30(event.target.checked);
  };

  useEffect(() => {
    getTokenInfo(symbol).then((response) => {
      setTokenInfo(response);
      if (response?.create_time) {
        let startTime = response.create_time.split(' ')[0] + ' 00:00:00';
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
      let label = pbvType.split('_')[0] + 'PriceByVolume';
      getChartData({
        token_symbol: symbol,
        chart_label: label,
        start_time: formatToDateTimeString(startTime),
        end_time: formatToDateTimeString(endTime)
      }).then((response) => {
        setPbvData(response ? response : []);
        if (response?.length > 0) {
          if (pbvType.split('_')[0] == 'Trade') {
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
                data: getPBVData(response, `total_+${pbvType}`),
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
      },
      {
        name: 'Price',
        type: 'candlestick',
        data: [],
        yAxisIndex: 0,
        itemStyle: {
          color0: '#ef232a',
          color: '#14b143',
          borderColor0: '#ef232a',
          borderColor: '#14b143'
        }
      }
    ];
    if (priceLineType === 'candlestick') {
      priceSeries = [
        {
          name: 'AvgPrice',
          type: 'line',
          yAxisIndex: 0,
          symbol: 'none',
          data: priceData.map((item) => item.avg_price),
          smooth: true
        },
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
    }

    setPriceSeries(priceSeries);
  }, [priceLineType, priceData]);

  useEffect(() => {
    if (showMa7) {
      setMa7Series([
        {
          name: 'MA7',
          type: 'line',
          data: calculateMA(
            priceData.map((item) => item.avg_price),
            7
          ),
          smooth: true,
          yAxisIndex: 0,
          symbol: 'none',
          lineStyle: {
            color: 'rgb(255, 140, 0)' // Optionally, set the line color
          }
        }
      ]);
    } else {
      setMa7Series([
        {
          name: 'MA7',
          type: 'line',
          data: [],
          smooth: true,
          yAxisIndex: 0,
          symbol: 'none',
          lineStyle: {
            color: 'rgb(255, 140, 0)' // Optionally, set the line color
          }
        }
      ]);
    }
  }, [priceData, showMa7]);
  useEffect(() => {
    if (showMa30) {
      setMa30Series([
        {
          name: 'MA30',
          type: 'line',
          data: calculateMA(
            priceData.map((item) => item.avg_price),
            30
          ),
          smooth: true,
          yAxisIndex: 0,
          symbol: 'none',
          lineStyle: {
            color: 'rgb(255, 0, 0)' // Optionally, set the line color
          }
        }
      ]);
    } else {
      setMa30Series([
        {
          name: 'MA30',
          type: 'line',
          data: [],
          smooth: true,
          yAxisIndex: 0,
          symbol: 'none',
          lineStyle: {
            color: 'rgb(255, 0, 0)' // Optionally, set the line color
          }
        }
      ]);
    }
  }, [priceData, showMa30]);

  useEffect(() => {
    if (pbvType != '' && pbvData?.length > 0) {
      const minPrice = priceData.reduce((min, p) => (p.low < min ? p.low : min), priceData[0].low);
      let maxPrice = priceData.reduce((max, p) => (p.high > max ? p.high : max), priceData[0].high);

      setYAxisSeries([
        {
          type: 'value',
          position: 'right',
          // name: 'Price',
          max: maxPrice,
          min: minPrice,
          axisLine: {
            lineStyle: {
              color: '#f39c12'
            }
          },
          axisLabel: {
            formatter: '${value}'
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(150, 150, 150, 0.5)', // Light gray color with transparency
              width: 1 // Optional: you can adjust the width to make the lines thinner
            }
          }
        },
        {
          offset: 0,
          type: 'value',
          // name: 'Volume',
          gridIndex: 1, // Grid for volume
          position: 'right', // This is the new yAxis for volume on the left
          axisLine: {
            lineStyle: {
              color: '#2ecc71'
            }
          },
          axisLabel: {
            show: false,
            formatter: '{value}'
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(150, 150, 150, 0.2)', // Light gray with transparency
              width: 1 // Adjust the width if needed
            }
          }
        },
        {
          type: 'category',
          data: pbvData?.map((item) => item.price_range_lower),
          name: 'Price Levels',
          nameLocation: 'middle',
          axisLine: {
            lineStyle: {
              color: '#999'
            }
          },
          axisLabel: {
            show: false
            // formatter: function (value) {
            //   return `$${value}`;
            // }
          }
        }
      ]);
    } else {
      setYAxisSeries([
        {
          type: 'value',
          position: 'right',
          axisLine: {
            lineStyle: {
              color: '#f39c12'
            }
          },
          axisLabel: {
            formatter: '${value}'
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(150, 150, 150, 0.5)', // Light gray color with transparency
              width: 1 // Optional: you can adjust the width to make the lines thinner
            }
          }
        },
        {
          offset: 0,
          type: 'value',
          gridIndex: 1, // Grid for volume
          position: 'right', // This is the new yAxis for volume on the left
          axisLine: {
            lineStyle: {
              color: '#2ecc71'
            }
          },
          axisLabel: {
            show: false,
            formatter: '{value}'
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(150, 150, 150, 0.2)', // Light gray with transparency
              width: 1 // Adjust the width if needed
            }
          }
        },
        {
          type: 'category',
          data: pbvData?.map((item) => item.price_range_lower),
          name: 'Price Levels',
          nameLocation: 'middle',
          axisLine: {
            lineStyle: {
              color: '#999'
            }
          },
          axisLabel: {
            show: false
          }
        }
      ]);
    }
  }, [symbol, priceData, pbvData]);

  useEffect(() => {
    setCombinedSeries([...priceSeries, ...avgCostSeries, ...volumeSeries, ...pbvSeries, ...ma7Series, ...ma30Series]);
  }, [priceSeries, avgCostSeries, volumeSeries, pbvSeries, ma7Series, ma30Series]);

  return (
    <MainCard sx={{ mt: 0, p: 0 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <TokenInf symbol={symbol} />
      </Box>
      <Divider />
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mt: 1, height: '30px' }}>
        <FormGroup row>
          <FormControlLabel
            control={
              <Checkbox
                defaultChecked
                onChange={onAvgCostChange}
                sx={{
                  '& .MuiSvgIcon-root': {
                    fontSize: 16 // Change the size of the checkbox icon (default is 24px)
                  }
                }}
              />
            }
            label={<span style={{ fontSize: '14px' }}>AvgCost</span>}
          />
          <FormControlLabel
            control={
              <Checkbox
                onChange={onMa7Change}
                sx={{
                  '& .MuiSvgIcon-root': {
                    fontSize: 16 // Change the size of the checkbox icon (default is 24px)
                  }
                }}
              />
            }
            label={<span style={{ fontSize: '14px' }}>MA7</span>}
          />
          <FormControlLabel
            control={
              <Checkbox
                onChange={onMa30Change}
                sx={{
                  '& .MuiSvgIcon-root': {
                    fontSize: 16 // Change the size of the checkbox icon (default is 24px)
                  }
                }}
              />
            }
            label={<span style={{ fontSize: '14px' }}>MA30</span>}
          />
          <Box sx={{ height: '48px', width: 300 }}>
            <Autocomplete
              sx={{ height: '48px' }}
              disablePortal
              options={['Trade_usd_volume', 'Tx_usd_volume', 'Trade_token_volume', 'Tx_token_volume', 'Wallet_cost_usd_pbv']}
              onChange={(event, newValue) => {
                setPbvType(newValue);
              }}
              renderInput={(params) => <TextField {...params} label="Indicator" size="small" />}
            />
          </Box>
        </FormGroup>
        <FormControlLabel control={<Switch onChange={switchKlineType} />} label="Kline" />

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
          <MainChart
            chartName={symbol}
            chartData={volumeData}
            yAxisSeries={yAxisSeries}
            dataSeries={combinedSeries}
            priceData={priceData}
          />
        </Box>
      </LocalizationProvider>
    </MainCard>
  );
};
export default ChartBox;
