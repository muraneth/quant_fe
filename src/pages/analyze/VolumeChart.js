import axios from 'axios';
import { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';

const PriceVolumeChart = ({ symbol, usd }) => {
  const [priceVolumeData, setPriceVolumeData] = useState([]);
  const [priceTimeSeriesData, setPriceTimeSeriesData] = useState([]);
  const [options, setOptions] = useState({});

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const postData = {
          token_symbol: symbol,
          chart_label: 'priceVolume'
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
          chart_label: 'priceVolume'
        };
        const token = localStorage.getItem('token');
        const uid = localStorage.getItem('uid');
        const response = await axios.post(`http://127.0.0.1:5005/api/data/volume${usd}`, postData, {
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
  }, [symbol, usd]);

  useEffect(() => {
    const option = {
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: priceTimeSeriesData.map((item) => item.day),
        axisTick: {
          alignWithLabel: true
        }
      },
      yAxis: [
        {
          type: 'value',
          name: 'Price',
          position: 'left'
        },
        {
          type: 'value',
          name: 'Volume',
          position: 'right',
          axisLine: {
            lineStyle: {
              color: '#5470C6'
            }
          }
        }
      ],
      series: [
        {
          name: 'Price',
          type: 'line',
          data: priceTimeSeriesData.map((item) => item.price),
          yAxisIndex: 0
        },
        {
          name: 'Positive Volume',
          type: 'bar',
          data: priceVolumeData.map((item) => item.positive_volume),
          yAxisIndex: 1,
          itemStyle: {
            color: '#73C0DE'
          }
        },
        {
          name: 'Negative Volume',
          type: 'bar',
          data: priceVolumeData.map((item) => item.negative_volume),
          yAxisIndex: 1,
          itemStyle: {
            color: '#FF6F61'
          }
        }
      ],
      // Add the dataZoom feature
      dataZoom: [
        {
          type: 'slider', // Create a resize bar along the x-axis
          xAxisIndex: 0, // Apply to the x-axis
          start: 0, // Percentage to start at (0%)
          end: 100 // Percentage to end at (100%)
        }
      ]
    };
    setOptions(option);
  }, [priceVolumeData, priceTimeSeriesData]);

  return <ReactECharts option={options} style={{ height: 400, width: '100%' }} />;
};

export default PriceVolumeChart;
