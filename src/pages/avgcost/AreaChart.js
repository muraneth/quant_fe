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

const SMALL_VALUE = 1e-10; // Small value to replace 0s

function isNotSeperatePrice(chart) {
  const items = ['avgCost', 'dexAvgCost', 'cexAvgCost', 'avgCostExcept'];
  return items.includes(chart);
}

const WalletChart = ({ symbol, chart }) => {
  const theme = useTheme();
  const chartRef = useRef(null);
  const [chartInstance, setChartInstance] = useState(null);

  const [chartData, setChartData] = useState([]);
  const [logScale, setLogScale] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const startDate = new Date();
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
        setChartData(response.data.data ? response.data.data : []);
      } catch (error) {
        setChartData([]);
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [symbol, chart]);

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
      const adjustedData = chartData.map((item) => ({
        ...item,
        value: logScale && item.value === 0 ? SMALL_VALUE : item.value
        // value: logScale && item.value > 0 ? Math.log10(item.value) : item.value
      }));

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
          data: adjustedData.map((item) => item.time),
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
        series: [
          {
            name: chart,
            type: 'line',
            areaStyle: {},
            data: adjustedData.map((item) => item.value),
            smooth: true
          },
          {
            name: 'price',
            type: 'line',
            yAxisIndex: isNotSeperatePrice(chart) ? 0 : 1,
            data: adjustedData.map((item) => item.price),
            smooth: true
          }
        ]
      };

      chartInstance.setOption(option);
    }
  }, [chartData, logScale, chartInstance, chart]);

  return (
    <div>
      {/* <FormControlLabel control={<Switch checked={logScale} onChange={() => setLogScale((prev) => !prev)} />} label="Logarithmic Scale" /> */}
      <div ref={chartRef} style={{ width: '100%', height: '450px' }} />
    </div>
  );
};

WalletChart.propTypes = {
  symbol: PropTypes.string.isRequired,
  chart: PropTypes.string.isRequired
};

export default WalletChart;
