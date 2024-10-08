import React from 'react';
import ReactECharts from 'echarts-for-react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
const PriceByVolumeChart = ({ symbol, path }) => {
  const [priceVolumeData, setPriceVolumeData] = useState([]);
  const [priceTimeSeriesData, setPriceTimeSeriesData] = useState([]);
  const [options, setOptions] = useState({});
  const [endTime, setEndTime] = useState('2024-10-06 00:00:00');

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const postData = {
          token_symbol: symbol,
          chart_label: 'priceVolume',
          end_time: endTime
        };
        const token = localStorage.getItem('token');
        const uid = localStorage.getItem('uid');

        const response = await axios.post(`http://127.0.0.1:5005/api/data/price`, postData, {
          headers: {
            Authorization: `${token}`,
            Uid: `${uid}`
          }
        });
        setPriceTimeSeriesData(response.data.data ? response.data.data : []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    const fetchVolume = async () => {
      try {
        const postData = {
          token_symbol: symbol,
          chart_label: 'priceVolume',
          end_time: endTime
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
  }, [symbol, path, endTime]);

  useEffect(() => {
    if (!priceVolumeData.length || !priceTimeSeriesData.length) {
      return;
    }
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
          // min: 100,
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
          type: 'line',
          yAxisIndex: 1, // Use the secondary Y-axis for price
          xAxisIndex: 1, // Use the secondary X-axis for time
          data: priceTimeSeriesData.map((item) => item.price),
          smooth: true, // Smooth the price line
          lineStyle: {
            color: '#f39c12',
            width: 2
          },
          symbol: 'circle',
          symbolSize: 8
        }
      ]
    };
    setOptions(option);
  }, [priceVolumeData, priceTimeSeriesData]);

  return (
    <div>
      <TextField label="End Time" variant="outlined" value={endTime} onChange={(e) => setEndTime(e.target.value)} fullWidth />
      {/* <TextField
        label="End Time"
        variant="outlined"
        value={endTime}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            setEndTime(e.target.value);
            // You can also call other functions here
          }
        }}
        fullWidth
      /> */}
      <ReactECharts option={options} style={{ height: '400px', width: '100%' }} />
    </div>
  );
};

export default PriceByVolumeChart;
