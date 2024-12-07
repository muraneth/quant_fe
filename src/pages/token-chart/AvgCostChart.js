import { useState, useEffect, useRef } from 'react';
import { useTheme } from '@mui/material/styles';

import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, TitleComponent, LegendComponent, DataZoomComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { padArrayAhead } from 'utils/common';

import { numberFormatter } from 'utils/common';

echarts.use([LineChart, GridComponent, TooltipComponent, TitleComponent, LegendComponent, DataZoomComponent, CanvasRenderer]);

const AvgCostChart = ({ chartName, chartData, priceSeries, priceData }) => {
  const theme = useTheme();
  const chartRef = useRef(null);
  const [chartInstance, setChartInstance] = useState(null);

  useEffect(() => {
    if (chartRef.current) {
      const myChart = echarts.init(chartRef.current);
      setChartInstance(myChart);

      const handleResize = () => {
        myChart.resize();
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        myChart.dispose();
      };
    }
  }, []);

  useEffect(() => {
    if (chartInstance) {
      if (chartData.length < priceData.length) {
        chartData = padArrayAhead(chartData, priceData.length);
      }
      console.log('chartData', chartData);

      const option = {
        // tooltip: {
        //   trigger: 'axis',
        //   axisPointer: {
        //     type: 'cross'
        //   }
        // },
        tooltip: {
          trigger: 'axis',
          formatter: function (params) {
            let result = `<strong>Date:</strong> ${params[0].axisValue}<br/>`;
            // console.log('params', params);

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

        legend: {
          data: [chartName, ...priceSeries.map((series) => series.name)]
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '15%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: priceData.map((item) => item.time),
          axisLabel: {
            color: 'gray'
          }
        },
        yAxis: [
          {
            type: 'value',
            // name: 'Value & Price',
            axisLabel: {
              formatter: '{value}'
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: 'rgba(200, 200, 200, 0.3)', // Very light gray with transparency
                // or use '#eeeeee' for a light solid color
                width: 0.5, // Thinner line
                type: 'solid' // or 'dashed', 'dotted'
              }
            }
          }
        ].filter(Boolean),

        dataZoom: [
          {
            type: 'slider',
            xAxisIndex: 0,
            filterMode: 'filter'
          },
          {
            type: 'inside',
            xAxisIndex: 0,
            filterMode: 'filter',
            disabled: true
          }
        ],
        graphic: [
          {
            type: 'text',
            left: 200, // pixels from left
            top: 100,
            // left: 'center',
            // top: 'center',
            style: {
              // text: 'tokenalytic.com',
              fontSize: 20,
              // fontWeight: 'bold',
              fill: 'rgba(100, 1000, 0, 0.2)', // Semi-transparent watermark
              textAlign: 'center'
            }
          }
        ],
        series: [
          {
            name: chartName,
            type: 'line',
            areaStyle: {
              color: 'rgba(0, 123, 255, 0.2)' // Adjust the RGB and opacity as needed
            },
            lineStyle: {
              color: 'rgb(0, 123, 255)' // Optionally, set the line color
            },
            data: chartData.map((item) => item?.value),
            smooth: true,
            symbol: 'none'
          },
          ...priceSeries
        ]
      };

      chartInstance.setOption(option);
    }
  }, [chartData, priceSeries, chartInstance, chartName, priceData]);

  return (
    <div>
      {/* <FormControlLabel control={<Switch checked={logScale} onChange={() => setLogScale((prev) => !prev)} />} label="Logarithmic Scale" /> */}
      <div ref={chartRef} style={{ width: '100%', height: '450px' }} />
    </div>
  );
};
export default AvgCostChart;
