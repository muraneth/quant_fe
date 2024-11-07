import React from 'react';
import ReactECharts from 'echarts-for-react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { getTokenPrice } from 'data-server/common';

const PriceByVolumeChart = ({ symbol, path }) => {
  const [priceVolumeData, setPriceVolumeData] = useState([]);
  const [priceTimeSeriesData, setPriceTimeSeriesData] = useState([]);
  const [options, setOptions] = useState({});

  const [startTime, setStartTime] = useState(dayjs('2021-01-01T00:00:00'));
  const [endTime, setEndTime] = useState(dayjs('2024-10-06T00:00:00'));

  const formatToDateTimeString = (date) => {
    return date ? date.format('YYYY-MM-DD HH:mm:ss') : '';
  };
  const upColor = '#ec0000';
  const upBorderColor = '#8A0000';
  const downColor = '#00da3c';
  const downBorderColor = '#008F28';

  const parseDataToKlineSeries = (data) => {
    return data.map((item) => {
      return [item.day, item.open, item.close, item.low, item.high];
    });
  }
  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const postData = {
          token_symbol: symbol,
          chart_label: 'priceVolume',
          start_time: formatToDateTimeString(startTime),
          end_time: formatToDateTimeString(endTime)
        };

        const response = await getTokenPrice(postData);
        setPriceTimeSeriesData(response.data ? response.data : []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    const fetchVolume = async () => {
      try {
        const postData = {
          token_symbol: symbol,
          chart_label: 'priceVolume',
          start_time: formatToDateTimeString(startTime),
          end_time: formatToDateTimeString(endTime)
        };
        const token = localStorage.getItem('token');
        const uid = localStorage.getItem('uid');
        const response = await axios.post(`http://127.0.0.1:5005/api/data/${path}`, postData, {
          headers: {
            Authorization: `${token}`,
            Uid: `${uid}`
          }
        });
        setPriceVolumeData(response.data.data ? response.data.data : []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchPrice();
    fetchVolume();
  }, [symbol, path, startTime, endTime]);

  useEffect(() => {
    if (!priceVolumeData.length || !priceTimeSeriesData.length) {
      return;
    }
    // get min price
    const minPrice = priceTimeSeriesData.reduce((min, p) => (p.low < min ? p.low : min), priceTimeSeriesData[0].low);
    const option = {
      title: {
        text: 'Price by Volume (PBV) Chart',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        formatter: function (params) {
          let result = `Price Range: ${params[1].name}<br/>`;
          result += `Volume: ${params[0].value}<br/>`;
          result += `Price: $${params[0].name}`;
          return result;
        }
      },
      grid: {
        left: '10%',
        right: '10%',
        bottom: '10%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'value',
          name: 'Volume',
          nameLocation: 'middle',
          // nameGap: 30,
          axisLine: {
            lineStyle: {
              color: '#999'
            }
          },
          axisLabel: {
            formatter: '{value}'
          }
        },
        {
          type: 'category',
          data: priceTimeSeriesData.map((item) => item.day),
          name: 'Time',
          nameLocation: 'middle',
          // nameGap: 30,
          axisLine: {
            lineStyle: {
              color: '#999'
            }
          }
        }
      ],
      yAxis: [
        {
          type: 'category',
          data: priceVolumeData.map((item) => item.price_range),
          name: 'Price Levels',
          nameLocation: 'middle',
          // nameGap: 50,
          axisLine: {
            lineStyle: {
              color: '#999'
            }
          },
          axisLabel: {
            formatter: function (value) {
              return `$${value}`;
            }
          }
        },
        {
          type: 'value',
          name: 'Price',
          position: 'right',
          min: minPrice,
          axisLine: {
            lineStyle: {
              color: '#f39c12'
            }
          },
          axisLabel: {
            formatter: '${value}'
          }
        }
      ],
      series: [
        {
          name: 'Volume',
          type: 'bar',
          data: priceVolumeData.map((item) => item.volume),
          barWidth: '40%',
          itemStyle: {
            color: '#73c0de'
          }
        },
        {
          name: 'Price',
          type: 'candlestick',
          yAxisIndex: 1, // Use the secondary Y-axis for price
          xAxisIndex: 1, // Use the secondary X-axis for time
          data:  parseDataToKlineSeries(priceTimeSeriesData),
          // lineStyle: {
          //   color: '#f39c12',
          //   width: 2
          // },
          itemStyle: {
            color: upColor,
            color0: downColor,
            borderColor: upBorderColor,
            borderColor0: downBorderColor
          },
          encode: {
            x: 0,
            y: [1, 4, 3, 2]
          }
        }
      ]
    };
    setOptions(option);
  }, [priceVolumeData, priceTimeSeriesData]);

  return (
   
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
        <ReactECharts option={options} style={{ height: '400px', width: '100%' }} />
      </div>
    </LocalizationProvider>
  );
};

export default PriceByVolumeChart;
