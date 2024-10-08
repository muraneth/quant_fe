import PropTypes from 'prop-types';
import { useState, useEffect, useRef } from 'react';
import { useTheme } from '@mui/material/styles';
import { green } from '@mui/material/colors';
import axios from 'axios';
import { Switch, FormControlLabel } from '@mui/material';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, TitleComponent, LegendComponent, DataZoomComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([LineChart, GridComponent, TooltipComponent, TitleComponent, LegendComponent, DataZoomComponent, CanvasRenderer]);


function isNotSeperatePrice(chart) {
  const items = ['avgCost', 'dexAvgCost', 'cexAvgCost', 'avgCostExcept'];
  return items.includes(chart);
}
const MultiChart = ({ chart, symbols }) => {
  const theme = useTheme();
  const chartRef = useRef(null);
  const [chartInstance, setChartInstance] = useState(null);
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    const fetchData = async (symbol) => {
      try {
        const postData = {
          token_symbol: symbol,
          chart_label: chart,
        };
        const token = localStorage.getItem('token');
        const uid = localStorage.getItem('uid');

        const response = await axios.post(`http://127.0.0.1:5005/api/data/chart`, postData, {
          headers: {
            Authorization: `${token}`,
            Uid: `${uid}`,
          },
        });

        setChartData(prevChartData => ({
          ...prevChartData,
          [symbol]: response.data.data || [],
        }));
        
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    symbols.forEach(symbol => {
      // Check if the symbol exists in chartData
      if (!(symbol in chartData)) {
        fetchData(symbol);
      }
    });
  }, [symbols, chart]);

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
    

      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        legend: {
          data: [chart, 'price']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '15%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data:  chartData[symbols[0]].map((item) => item.time),
          axisLabel: {
            color: 'gray'
          }
        },
        yAxis: [
          {
            type: 'value',
            name: 'Value & Price',
            axisLabel: {
              formatter: '{value}'
            },
            scale: logScale
          },
          isNotSeperatePrice(chart) === false && {
            type: 'value',
            name: 'Price',
            axisLabel: {
              formatter: '{value}'
            },
            scale: logScale
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
            filterMode: 'filter'
          }
        ],
        series: symbols.map(symbol => ({
          name: symbol,
          type: 'line', // Adjust type as needed (e.g., 'bar', 'scatter')
          yAxisIndex: isNotSeperatePrice(chart) ? 0 : 1,
          data: chartData[symbol] ? chartData[symbol].map(item => item.value) : [],
        })),
      };

      chartInstance.setOption(option);
    }
  }, [chartData, logScale, chartInstance, chart]);

  return (
    <div>
     
      <div ref={chartRef} style={{ width: '100%', height: '450px' }} />
    </div>
  );
};

MultiChart.propTypes = {
  symbol: PropTypes.string.isRequired,
  chart: PropTypes.string.isRequired
};

export default MultiChart;
