import React from 'react';
import ReactECharts from 'echarts-for-react';

import { useState, useEffect } from 'react';

const MainChart = ({ chartName, chartData, yAxisSeries, dataSeries, priceData }) => {
  const [options, setOptions] = useState({});

  const dataFormatter = (data) => {
    if (data === undefined) {
      return 'N/A';
    }
    if (Math.abs(data) > 1000000000) {
      return (data / 1000000000).toFixed(2) + 'B';
    } else if (Math.abs(data) > 1000000) {
      return (data / 1000000).toFixed(2) + 'M';
    } else if (Math.abs(data) > 1000) {
      return (data / 1000).toFixed(2) + 'K';
    } else if (Math.abs(data) > 1) {
      return data.toFixed(2);
    } else if (Math.abs(data) > 0.01) {
      return data.toFixed(4);
    } else if (Math.abs(data) > 0.0001) {
      return data.toFixed(6);
    } else if (Math.abs(data) > 0.00001) {
      return data.toFixed(8);
    }
    return data.toFixed(10);
  };
  useEffect(() => {
    if (!priceData.length) {
      return;
    }

    const option = {
      tooltip: {
        trigger: 'axis',
        formatter: function (params) {
          let result = `<strong>Date:</strong> ${params[0].axisValue}<br/>`;
          console.log('params', params);

          params.forEach((param) => {
            if (param.seriesType === 'candlestick') {
              // Assuming param.value format is [open, close, low, high] for K-line
              const [key, open, close, low, high] = param.value;
              result += `
                <div style="margin: 5px 0; line-height: 1.5;">
                  <strong>${param.seriesName}:</strong><br/>
                  <span style="color: #999;">Open:</span> ${dataFormatter(open)}<br/>
                  <span style="color: #999;">Close:</span> ${dataFormatter(close)}<br/>
                  <span style="color: #999;">Low:</span> ${dataFormatter(low)}<br/>
                  <span style="color: #999;">High:</span> ${dataFormatter(high)}
                </div>
              `;
            } else {
              // For other series, just display series name and value
              if ((param.seriesName == 'Positive PBV' || param.seriesName == 'Negative PBV') && param.axisDim == 'x') {
                //skip
              } else if (param.seriesName == 'Positive PBV' && param.axisDim == 'y') {
                result += `
                <div style="margin: 5px 0; line-height: 1.5;">
                  <span style="display: inline-block; width: 10px; height: 10px; background-color: ${param.color}; border-radius: 50%; margin-right: 5px;"></span>
                  <strong>${param.seriesName}:</strong> [range: ${param.axisValue} value: ${dataFormatter(param.value)}]
                 
                </div>
              `;
              } else {
                result += `
                <div style="margin: 5px 0; line-height: 1.5;">
                  <span style="display: inline-block; width: 10px; height: 10px; background-color: ${param.color}; border-radius: 50%; margin-right: 5px;"></span>
                  <strong>${param.seriesName}:</strong> ${dataFormatter(param.value)}
                </div>
              `;
              }
            }
          });

          // Calculate percentage change if both values are defined
          if (params[1]?.value[2] !== undefined && params[1]?.value[1] !== undefined && params[1]?.value[1] !== 0) {
            const percentageChange = (((params[1].value[2] - params[1].value[1]) / params[1].value[1]) * 100).toFixed(2);
            result += `
              <div style="margin: 5px 0; line-height: 1.5;">
                <strong>Change:</strong> 
                 <span style="color: ${percentageChange >= 0 ? 'green' : 'red'};">${percentageChange}%</span>
              </div>
            `;
          }

          return result;
        }
      },

      grid: [
        {
          // Grid for price (main chart)
          left: '1%',
          right: '8%',
          // height: '65%'
          bottom: 200
        },
        {
          // Grid for volume (sub-chart)
          left: '1%',
          right: '8%',
          height: 80,
          bottom: 60
        }
      ],
      dataZoom: [
        {
          type: 'inside',
          xAxisIndex: [0, 1],
          start: 0,
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
          data: priceData.map((item) => item.time),
          // name: 'Time',
          nameLocation: 'middle',
          axisLine: {
            lineStyle: {
              color: '#999'
            }
          },
          splitLine: {
            show: false,
            lineStyle: {
              color: 'rgba(150, 150, 150, 0.3)', // Lighter color with transparency
              width: 1 // Optional: adjust the width for thinner lines
            }
          }
        },

        {
          type: 'category',
          gridIndex: 1,
          data: priceData.map((item) => item.time),
          boundaryGap: false,
          splitLine: { show: false },
          axisLabel: { show: false },
          axisTick: { show: false },
          axisLine: { lineStyle: { color: '#777' } },
          min: 'dataMin',
          max: 'dataMax'
        },
        {
          type: 'value',
          // name: 'PriceByVolume',
          offset: 10,
          nameLocation: 'middle',

          axisLine: {
            lineStyle: {
              color: '#999'
            }
          },
          axisLabel: {
            formatter: '{value}'
          },
          splitLine: {
            show: false
          }
        }
      ],
      yAxis: [...yAxisSeries],
      series: [...dataSeries]
    };

    setOptions(option);
  }, [chartName, chartData, dataSeries, priceData, yAxisSeries]);

  return <ReactECharts option={options} style={{ height: '800px', width: '100%' }} />;
};

export default MainChart;
