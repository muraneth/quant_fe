import React from 'react';
import ReactECharts from 'echarts-for-react';

import { useState, useEffect } from 'react';
import { stack } from 'd3';

const PriceByVolumeChart = ({ chartName, chartData, priceSeries, priceData }) => {
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
        left: '1%',
        right: '1%',
        bottom: '10%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: priceData.map((item) => item.time),
          name: 'Time',
          nameLocation: 'middle',
          // nameGap: 30,
          axisLine: {
            lineStyle: {
              color: '#999'
            }
          }
        },
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
        }
      ],
      yAxis: [
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
        },
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
        }
      ],
      series: [
        ...priceSeries,
        {
          name: 'Volume',
          type: 'bar',
          stack: 'pbvVolume',
          data: chartData.map((item) => item.negative_value),
          barWidth: '40%',
          yAxisIndex: 1,
          xAxisIndex: 1,
          itemStyle: {
            color: ' rgba(255, 111, 97, 0.5)' // Light red with 50% transparency
          }
        },
        {
          name: 'Volume',
          type: 'bar',
          stack: 'pbvVolume',
          data: chartData.map((item) => item.positive_value),
          barWidth: '40%',
          yAxisIndex: 1,
          xAxisIndex: 1,
          itemStyle: {
            color: '#73c0de'
          }
        }
      ]
    };
    setOptions(option);
  }, [chartName, chartData, priceSeries, priceData]);

  return <ReactECharts option={options} style={{ height: '600px', width: '100%' }} />;
};

export default PriceByVolumeChart;
