import PropTypes from 'prop-types';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, LegendComponent, DataZoomComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import ReactECharts from 'echarts-for-react';

echarts.use([LineChart, GridComponent, TooltipComponent, LegendComponent, DataZoomComponent, CanvasRenderer]);

function isNotSeperatePrice(chart) {
  const items = ['avgCost', 'dexAvgCost', 'cexAvgCost', 'avgCostExcept'];
  return items.includes(chart);
}

const MultiChart = ({ chart, symbols, zoom, onZoomChange }) => {
  const [chartData, setChartData] = useState({});
  const [options, setOptions] = useState({});
  const chartRef = useRef(null); // Ref to store the chart instance

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
      fetchData(symbol);
    });
  }, [symbols, chart]);

  const calculateMovingAverage = (data, windowSize) => {
    if (!data || data.length === 0) return [];
    const movingAvg = [];
    for (let i = 0; i < data.length; i++) {
      if (i < windowSize - 1) {
        movingAvg.push(null); // Not enough data points
      } else {
        const window = data.slice(i - windowSize + 1, i + 1);
        const sum = window.reduce((acc, curr) => acc + (curr.value || 0), 0);
        movingAvg.push(sum / windowSize);
      }
    }
    return movingAvg;
  };

  const padArray = (arr, length) => {
    const newArr = [...arr];
    while (newArr.length < length) {
      newArr.unshift(null);
    }
    return newArr;
  };

  useEffect(() => {
    if (Object.keys(chartData).length > 0) {
      const keys = Object.keys(chartData);
      let mxSymbol = keys.reduce((a, b) => (chartData[a].length > chartData[b].length ? a : b));
      const maxLength = chartData[mxSymbol].length;

      keys.forEach((symbol) => {
        chartData[symbol] = padArray(chartData[symbol], maxLength);
      });

      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },

        legend: {
          left: 'mid',
          textStyle: {
            color: 'white', // Set your desired color here
            fontSize: 12 // Optional: customize font size
          }
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
          },
          isNotSeperatePrice(chart) === false && {
            type: 'value',
            name: 'Price',
            axisLabel: {
              formatter: '{value}'
            }
          }
        ].filter(Boolean),
        dataZoom: [
          {
            type: 'slider',
            xAxisIndex: 0,
            filterMode: 'filter',
            start: zoom.min,
            end: zoom.max
          },
          {
            type: 'inside',
            xAxisIndex: 0,
            filterMode: 'filter',
            disabled: true
          }
        ],
        series: keys.map((symbol) => ({
          name: symbol,
          type: 'line',
          yAxisIndex: isNotSeperatePrice(chart) ? 0 : 1,
          data: chartData[symbol] ? chartData[symbol].map((item) => (item ? item.value : 0)) : []
        }))
      };

      setOptions(option);
    }
  }, [chartData, chart, symbols, zoom]);

  // Chart instance callback to handle dataZoom event
  const onChartReady = (echartsInstance) => {
    chartRef.current = echartsInstance;

    echartsInstance.on('dataZoom', (evt) => {
      console.log('dataZoom', evt);
      // if (!evt.batch) {
      //   return;
      // }
      const { start, end } = evt; // Get the zoom range
      onZoomChange({ min: start, max: end }); // Update zoom in parent
    });
  };

  return (
    <ReactECharts
      option={options}
      style={{ height: 400, width: '100%' }}
      onChartReady={onChartReady} // Pass the callback to get the chart instance
    />
  );
};

MultiChart.propTypes = {
  chart: PropTypes.string.isRequired,
  symbols: PropTypes.arrayOf(PropTypes.string).isRequired,
  zoom: PropTypes.shape({
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired
  }).isRequired,
  onZoomChange: PropTypes.func.isRequired
};

export default MultiChart;
