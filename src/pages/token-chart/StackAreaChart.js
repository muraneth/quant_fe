import { useState, useEffect, useRef } from 'react';
import { useTheme } from '@mui/material/styles';

import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, TitleComponent, LegendComponent, DataZoomComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { area, stack } from 'd3';

echarts.use([LineChart, GridComponent, TooltipComponent, TitleComponent, LegendComponent, DataZoomComponent, CanvasRenderer]);

const StackAreaChart = ({ chartName, chartDataList, priceSeries, priceData }) => {
  const theme = useTheme();
  const chartRef = useRef(null);
  const [chartInstance, setChartInstance] = useState(null);
  const [dataSeries, setDataSeries] = useState([]);

  useEffect(() => {
    if (chartDataList) {
      console.log("length datalist", chartDataList.length);
      
      const series = chartDataList.map((chartData) => {
        return {
          name: chartData.name,
          type: 'line',
          areaStyle: {},
          stack: 'total',
          yAxisIndex: 1,
          data: chartData?.map((item) => item?.value),
          smooth: true,
          symbol: 'none'
        };
      });
      setDataSeries(series);
    }
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
    
  }, [chartDataList]);

  useEffect(() => {
    if (chartInstance) {
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        // legend: {
        //   data: [chartName, ...priceSeries.map((series) => series.name)]
        // },
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
            name: 'Price ',
            position: 'left',
            axisLabel: {
              formatter: '{value}'
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: 'rgba(150, 150, 150, 0.5)', // Light gray color with transparency
                width: 1 // Optional: you can adjust the width to make the lines thinner
              }
            }
          },
          {
            type: 'value',
            name: 'Value',
            axisLabel: {
              formatter: '{value}'
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
            left: 'center',
            top: 'center',
            style: {
              text: 'MatrixCipher.com',
              fontSize: 60,
              fontWeight: 'bold',
              fill: 'rgba(100, 1000, 0, 0.2)', // Semi-transparent watermark
              textAlign: 'center'
            }
          }
        ],
        series: [
         
          ...priceSeries,
          ...dataSeries
        ]
      };
      console.log('stack option', option);
      
      console.log("dataSeries", dataSeries);
      
      chartInstance.setOption(option);
    }
  }, [dataSeries, priceSeries, chartInstance, chartName, priceData]);

  return (
    <div>
      {/* <FormControlLabel control={<Switch checked={logScale} onChange={() => setLogScale((prev) => !prev)} />} label="Logarithmic Scale" /> */}
      <div ref={chartRef} style={{ width: '100%', height: '450px' }} />
    </div>
  );
};
export default StackAreaChart;