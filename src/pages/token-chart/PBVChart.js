import React from 'react';
import ReactECharts from 'echarts-for-react';

import { useState, useEffect } from 'react';


const PriceByVolumeChart = ({ chartName, chartData, priceSeries,priceData }) => {

  const [options, setOptions] = useState({});


  useEffect(() => {
    if (!chartData.length || !priceData.length) {
      return;
    }
    // get min price
    const minPrice = priceData.reduce((min, p) => (p.low < min ? p.low : min), priceData[0].low);
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
          data: priceData.map((item) => item.day),
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
          data: chartData.map((item) => item.price_range),
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
          data: chartData.map((item) => item.volume),
          barWidth: '40%',
          itemStyle: {
            color: '#73c0de'
          }
        },
        ...priceSeries
       
      ]
    };
    setOptions(option);
  }, [chartName, chartData, priceSeries,priceData ]);

  return (
        <ReactECharts option={options} style={{ height: '400px', width: '100%' }} />
  );
};

export default PriceByVolumeChart;