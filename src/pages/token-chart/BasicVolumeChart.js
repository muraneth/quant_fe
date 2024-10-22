import axios from 'axios';
import { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';

const PriceVolumeChart = ({ chartName, chartData, priceSeries }) => {
  const [options, setOptions] = useState({});

  useEffect(() => {
    const option = {
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: chartData?.map((item) => item.time),
        axisTick: {
          alignWithLabel: true
        }
      },
      yAxis: [
        {
          type: 'value',
          name: 'Price',
          position: 'left'
          // scale: true
          // min: function (value) {
          //   return value.min - (value.max - value.min) * 0.5; // Add 20% padding below
          // }
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
          name: 'Buy Volume',
          type: 'bar',
          data: chartData?.map((item) => item.buy_volume),
          yAxisIndex: 1,
          itemStyle: {
            color: '#73C0DE'
          }
        },
        {
          name: 'Sell Volume',
          type: 'bar',
          data: chartData?.map((item) => item.sell_volume),
          yAxisIndex: 1,
          itemStyle: {
            color: '#FF6F61'
          }
        },
        ...priceSeries
      ],

      dataZoom: [
        {
          type: 'slider', // Create a resize bar along the x-axis
          xAxisIndex: 0, // Apply to the x-axis
          start: 0, // Percentage to start at (0%)
          end: 100, // Percentage to end at (100%)
          disable: true
        }
      ]
    };
    setOptions(option);
  }, [chartData, priceSeries]);

  return <ReactECharts option={options} style={{ height: 400, width: '100%' }} />;
};

export default PriceVolumeChart;
