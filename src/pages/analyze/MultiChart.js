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
import ReactECharts from 'echarts-for-react';

echarts.use([LineChart, GridComponent, TooltipComponent, TitleComponent, LegendComponent, DataZoomComponent, CanvasRenderer]);

function isNotSeperatePrice(chart) {
  const items = ['avgCost', 'dexAvgCost', 'cexAvgCost', 'avgCostExcept'];
  return items.includes(chart);
}

const MultiChart = ({ chart, symbols }) => {
  const [chartData, setChartData] = useState({});
  const [options, setOptions] = useState({});
  useEffect(() => {
    const fetchData = async (symbol) => {
      try {
        const postData = {
          token_symbol: symbol,
          chart_label: chart
        };
        const token = localStorage.getItem('token');
        const uid = localStorage.getItem('uid');

        const response = await axios.post(`http://127.0.0.1:5005/api/data/chart`, postData, {
          headers: {
            Authorization: `${token}`,
            Uid: `${uid}`
          }
        });

        setChartData((prevChartData) => ({
          ...prevChartData,
          [symbol]: response.data.data || []
        }));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    symbols.forEach((symbol) => {
      // Check if the symbol exists in chartData
      if (!(symbol in chartData)) {
        fetchData(symbol);
      }
    });
  }, [symbols, chart]);

  const padArray = (arr, length) => {
    const newArr = [...arr]; // Create a copy to avoid mutating the original array
    while (newArr.length < length) {
      // arr.push(null);
      newArr.unshift(null); // Add nulls to the head
    }
    return newArr;
  };

  useEffect(() => {
    if (chartData && chartData[symbols[0]]) {
      const keys = Object.keys(chartData);
      let mxSymbol;
      console.log('chartData key lenght ', keys.length);
      if (keys.length > 1) {
        // Determine the symbol with the maximum data length
        mxSymbol = keys.reduce((a, b) => (chartData[a].length > chartData[b].length ? a : b));

        const maxLength = chartData[mxSymbol].length; // Maximum length of data
        console.log('mxSymbol', mxSymbol);
        console.log('maxLength', maxLength);
        // Pad all symbol arrays to match the maximum length
        keys.forEach((symbol) => {
          chartData[symbol] = padArray(chartData[symbol], maxLength);
        });
      } else {
        mxSymbol = symbols[0]; // Only one symbol
      }
      keys.map((symbol) => {
        if (chartData[symbol]) {
          console.log(symbol, chartData[symbol].length);
        } else {
          console.log(symbol, 0);
        }
      });

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
          data: chartData[mxSymbol].map((item) => (item ? item.time : 0)),
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
            }
            // scale: logScale
          },
          isNotSeperatePrice(chart) === false && {
            type: 'value',
            name: 'Price',
            axisLabel: {
              formatter: '{value}'
            }
            // scale: logScale
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
        series: keys.map((symbol) => ({
          name: symbol,
          type: 'line', // Adjust type as needed (e.g., 'bar', 'scatter')
          yAxisIndex: isNotSeperatePrice(chart) ? 0 : 1,
          data: chartData[symbol] ? chartData[symbol].map((item) => (item ? item.value : 0)) : []
        }))
      };

      // chartInstance.setOption(option);
      setOptions(option);
    }
  }, [chartData, chart, symbols]);
  return <ReactECharts option={options} style={{ height: 400, width: '100%' }} />;
};

MultiChart.propTypes = {
  symbol: PropTypes.string.isRequired,
  chart: PropTypes.string.isRequired
};

export default MultiChart;