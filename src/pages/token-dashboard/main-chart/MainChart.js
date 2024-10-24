import React from 'react';
import ReactECharts from 'echarts-for-react';

import { useState, useEffect } from 'react';

const MainChart = ({ chartName, chartData, priceSeries, priceData }) => {
  const [options, setOptions] = useState({});

  useEffect(() => {
    if (!priceData.length) {
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
          // let result = `Price Range: ${params[1].name}<br/>`;
          // result += `Volume: ${params[0].value}<br/>`;
          // result += `Price: $${params[0].name}`;
          // console.log('params 0', params[0]);

          let result = `${params[0].seriesName} : ${params[0].value}<br/>`;
          return result;
        }
      },
      // grid: {
      //   left: '10%',
      //   right: '10%',
      //   bottom: '10%',
      //   containLabel: true
      // },
      grid: [
        {
          // Grid for price (main chart)
          left: '10%',
          right: '8%',
          height: '60%'
        },
        {
          // Grid for volume (sub-chart)
          left: '10%',
          right: '8%',
          top: '75%',
          height: '40%'
        }
      ],
      xAxis: [
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
        },
        {
          type: 'category',
          gridIndex: 1,
          data: priceData.map((item) => item.day),
          boundaryGap: false,
          splitLine: { show: false },
          axisLabel: { show: false },
          axisTick: { show: false },
          axisLine: { lineStyle: { color: '#777' } },
          // min: 'dataMin',
          // max: 'dataMax',
          axisPointer: {
            type: 'shadow',
            label: { show: false },
            triggerTooltip: true,
            handle: {
              show: true,
              margin: 30,
              color: '#B80C00'
            }
          }
        }
        // {
        //   type: 'value',
        //   name: 'Volume',
        //   nameLocation: 'middle',
        //   // nameGap: 30,
        //   axisLine: {
        //     lineStyle: {
        //       color: '#999'
        //     }
        //   },
        //   axisLabel: {
        //     formatter: '{value}'
        //   }
        // }
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
          offset: 10,
          type: 'value',
          name: 'Volume',
          gridIndex: 1, // Grid for volume
          position: 'right', // This is the new yAxis for volume on the left
          axisLine: {
            lineStyle: {
              color: '#2ecc71'
            }
          },
          axisLabel: {
            formatter: '{value} units'
          }
        }
        // {
        //   type: 'category',
        //   data: chartData.map((item) => item.price_range),
        //   name: 'Price Levels',
        //   nameLocation: 'middle',
        //   // nameGap: 50,
        //   axisLine: {
        //     lineStyle: {
        //       color: '#999'
        //     }
        //   },
        //   axisLabel: {
        //     formatter: function (value) {
        //       return `$${value}`;
        //     }
        //   }
        // }
      ],
      series: [
        ...priceSeries
        // {
        //   name: 'Volume',
        //   type: 'bar',
        //   data: chartData.map((item) => item.volume),
        //   barWidth: '40%',
        //   yAxisIndex: 1,
        //   itemStyle: {
        //     color: '#73c0de'
        //   }
        // }
      ]
    };
    console.log('option', option);

    setOptions(option);
  }, [chartName, chartData, priceSeries, priceData]);

  return <ReactECharts option={options} style={{ height: '400px', width: '100%' }} />;
};

export default MainChart;
