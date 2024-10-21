import axios from 'axios';
import { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';

const PriceVolumeChart = ({ chartName,chartData,priceSeries }) => {

  const [options, setOptions] = useState({});


  useEffect(() => {
    const option = {
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: chartData?.map((item) => item.day),
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
          name: 'Positive Volume',
          type: 'bar',
          data: chartData?.map((item) => item.positive_volume),
          yAxisIndex: 1,
          itemStyle: {
            color: '#73C0DE'
          }
        },
        {
          name: 'Negative Volume',
          type: 'bar',
          data: chartData?.map((item) => item.negative_volume),
          yAxisIndex: 1,
          itemStyle: {
            color: '#FF6F61'
          }
        },
        ...priceSeries
      ],
      // Add the dataZoom feature
      dataZoom: [
        {
          type: 'slider', // Create a resize bar along the x-axis
          xAxisIndex: 0, // Apply to the x-axis
          start: 0, // Percentage to start at (0%)
          end: 100 // Percentage to end at (100%)
          
        },
       
      ]
    };
    setOptions(option);
  }, [chartData, priceSeries]);

  return <ReactECharts option={options} style={{ height: 400, width: '100%' }} />;
};

export default PriceVolumeChart;
