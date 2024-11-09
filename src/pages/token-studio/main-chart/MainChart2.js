import React from 'react';
import ReactECharts from 'echarts-for-react';

import { useState, useEffect } from 'react';
import { numberFormatter } from 'utils/common';
const MainChart = ({ chartName, xAxis, yAxis, dataSeries }) => {
  const [options, setOptions] = useState({});

  useEffect(() => {
    const option = {
      tooltip: {
        trigger: 'axis',
        formatter: function (params) {
          let result = `<strong>Date:</strong> ${params[0].axisValue}<br/>`;
          // console.log('params', params);

          params.forEach((param) => {
            if (param.seriesType === 'candlestick') {
              const [key, open, close, low, high] = param.value;
              const percentageChange = (((close - open) / open) * 100).toFixed(2);

              result += `
                <div style="margin: 5px 0; line-height: 1.5;">
                  <strong>${param.seriesName}:</strong> 
                  <span style="color: #999;">Open:</span> ${numberFormatter(open)} 
                  <span style="color: #999;">Close:</span> ${numberFormatter(close)} 
                  <span style="color: #999;">Low:</span> ${numberFormatter(low)} 
                  <span style="color: #999;">High:</span> ${numberFormatter(high)}
                  <strong>Change:</strong> 
                  <span style="color: ${percentageChange >= 0 ? 'green' : 'red'};">${percentageChange}%</span>
                   
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

          return result;
        }
      },

      grid: [
        {
          // Grid for price (main chart)
          left: '40',
          right: '40',
          // height: '65%',
          top: 0,
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
      xAxis: [...xAxis],
      yAxis: [...yAxis],
      series: [...dataSeries]
    };
    console.log('option', option);

    setOptions(option);
  }, [chartName, xAxis, yAxis, dataSeries]);

  return <ReactECharts option={options} style={{ height: '85vh', width: '100%' }} />;
};

export default MainChart;
