import React from 'react';
import ReactECharts from 'echarts-for-react';

import { useState, useEffect } from 'react';
import { numberFormatter } from 'utils/common';
const MainChart = ({ chartName, chartData, yAxisSeries, dataSeries, priceData }) => {
  const [options, setOptions] = useState({});

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
                  <strong>${param.seriesName}:</strong> 
                  <span style="color: #999;">Open:</span> ${numberFormatter(open)} 
                  <span style="color: #999;">Close:</span> ${numberFormatter(close)} 
                  <span style="color: #999;">Low:</span> ${numberFormatter(low)} 
                  <span style="color: #999;">High:</span> ${numberFormatter(high)}
                   <strong>Change:</strong> 
                   
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
                  <strong>${param.seriesName}:</strong> [range: ${param.axisValue} value: ${numberFormatter(param.value)}]
                 
                </div>
              `;
              } else {
                result += `
                <div style="margin: 5px 0; line-height: 1.5;">
                  <span style="display: inline-block; width: 10px; height: 10px; background-color: ${param.color}; border-radius: 50%; margin-right: 5px;"></span>
                  <strong>${param.seriesName}:</strong> ${numberFormatter(param.value)}
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
          left: '40',
          right: '40',
          // height: '65%',
          top: 20,
          bottom: 180
        },
        {
          // Grid for volume (sub-chart)
          left: '40',
          right: '40',
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
          offset: 10,
          type: 'category',
          data: priceData.map((item) => item.time),
          // name: 'Time',
          nameLocation: 'middle',
          axisLine: {
            show: false,
            lineStyle: {
              color: '#999'
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
          offset: 0,
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
    console.log('option', option);

    setOptions(option);
  }, [chartName, chartData, dataSeries, priceData, yAxisSeries]);
  if (!priceData.length || !options || !options.series) {
    return <div>Loading...</div>;
  }
  return <ReactECharts option={options} style={{ height: '85vh', width: '100%' }} />;
};

export default MainChart;
