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
import { getTokenPrice } from 'data-server/common';
import { getChartData } from 'data-server/chart';

echarts.use([LineChart, GridComponent, TooltipComponent, TitleComponent, LegendComponent, DataZoomComponent, CanvasRenderer]);

const SMALL_VALUE = 1e-10; // Small value to replace 0s

function isNotSeperatePrice(chart) {
  const items = ['AvgCost', 'DexAvgCost', 'CexAvgCost', 'AvgCostExcept'];
  return items.includes(chart);
}

const WalletChart2 = ({ symbol, chart }) => {
  const theme = useTheme();
  const chartRef = useRef(null);
  const [chartInstance, setChartInstance] = useState(null);

  const [chartData, setChartData] = useState([]);
  const [priceTimeSeriesData, setPriceTimeSeriesData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postData = {
          symbol: symbol,
          handle_name: chart
        };
        getTokenPrice(postData).then((response) => {
          setPriceTimeSeriesData(response.data ? response.data : []);
        });

        getChartData(postData).then((response) => {
          setChartData(response.data ? response.data : []);
        });
      } catch (error) {
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
            filterMode: 'filter'
          },
          {
            type: 'inside',
            xAxisIndex: 0,
            filterMode: 'filter'
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
          {
            name: chart,
            type: 'line',
            areaStyle: {},
            data: chartData.map((item) => item.value),
            smooth: true
          },
          {
            name: 'price',
            type: 'line',
            yAxisIndex: isNotSeperatePrice(chart) ? 0 : 1,
            data: priceTimeSeriesData.map((item) => item.price),
            smooth: true
          }
        ]
      };

      chartInstance.setOption(option);
    }
  }, [chartData, priceTimeSeriesData, chartInstance, chart]);

  return (
    <div>
      {/* <FormControlLabel control={<Switch checked={logScale} onChange={() => setLogScale((prev) => !prev)} />} label="Logarithmic Scale" /> */}
      <div ref={chartRef} style={{ width: '100%', height: '450px' }} />
    </div>
  );
};

WalletChart2.propTypes = {
  symbol: PropTypes.string.isRequired,
  chart: PropTypes.string.isRequired
};

export default WalletChart2;
