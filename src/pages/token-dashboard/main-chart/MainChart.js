import React from 'react';
import ReactECharts from 'echarts-for-react';

import { useState, useEffect } from 'react';

const MainChart = ({ chartName, chartData, pbvData, dataSeries, priceData }) => {
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
          let result = `${params[0].seriesName} : ${params[0].value}<br/>`;
          return result;
        }
      },

      grid: [
        {
          // Grid for price (main chart)
          left: '10%',
          right: '8%',
          // height: '65%'
          bottom: 200
        },
        {
          // Grid for volume (sub-chart)
          left: '10%',
          right: '8%',
          height: 80,
          bottom: 60
        }
      ],
      dataZoom: [
        {
          type: 'inside',
          xAxisIndex: [0, 1],
          start: 10,
          end: 100
        },
        {
          show: true,
          xAxisIndex: [0, 1],
          type: 'slider',
          bottom: 10,
          start: 0,
          end: 100
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
          min: 'dataMin',
          max: 'dataMax'
          // axisPointer: {
          //   type: 'shadow',
          //   label: { show: false },
          //   triggerTooltip: true,
          //   handle: {
          //     show: true,
          //     margin: 30,
          //     color: '#B80C00'
          //   }
          // }
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
          offset: 10,
          type: 'value',
          name: 'Volume',
          // min: -,
          gridIndex: 1, // Grid for volume
          position: 'right', // This is the new yAxis for volume on the left
          axisLine: {
            lineStyle: {
              color: '#2ecc71'
            }
          },
          axisLabel: {
            formatter: '{value} units'
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
          data: pbvData?.map((item) => item.price_range),
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
      series: [...dataSeries]
    };
    console.log('option', option);

    setOptions(option);
  }, [chartName, chartData, dataSeries, priceData, pbvData]);

  return <ReactECharts option={options} style={{ height: '500px', width: '100%' }} />;
};

export default MainChart;
