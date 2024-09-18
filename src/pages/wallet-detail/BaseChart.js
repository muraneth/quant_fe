/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { common, green, orange } from '@mui/material/colors';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';

// chart options
const areaChartOptions = {
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth',
    width: 2
  },
  grid: {
    strokeDashArray: 0,
    borderColor: '#90A4AE'
  }
};
function isNotSeperatePrice(dataKey) {
  const items = ['avg_cost'];
  return items.includes(dataKey);
}
const BalanceChart = ({ chartData, dataKey }) => {
  const theme = useTheme();

  const { secondary } = theme.palette.text;
  const line = theme.palette.divider;

  const [options, setOptions] = useState(areaChartOptions);
  const [chartColor, setChartColor] = useState([green[500]]);
  const [series, setSeries] = useState([]);

  useEffect(() => {
    // If chartData is undefined or empty, avoid running the logic
    if (!chartData || chartData.length === 0) {
      return;
    }

    // Update chart options
    setOptions((prevState) => ({
      ...prevState,
      colors: chartColor,
      xaxis: {
        categories: chartData.map((item) => item.day),

        axisBorder: {
          show: true,
          color: line
        },
        labels: {
          style: {
            colors: 'gray'
          }
        },
        tickAmount: 20
      },
      yaxis: [
        {
          labels: {
            style: {
              colors: [secondary]
            },
            formatter: function (val) {
              return val; // Formatting Y-axis labels
            }
          },
          title: {
            text: 'Value & Price'
          }
        },
        isNotSeperatePrice(dataKey) === false && {
          opposite: true,
          labels: {
            style: {
              colors: [secondary]
            },
            formatter: function (val) {
              return val;
            }
          },
          title: {
            text: 'Price'
          }
        }
      ].filter(Boolean),
      grid: {
        borderColor: '#445661'
      },
      tooltip: {
        theme: 'dark',
        y: {
          formatter: function (val) {
            return val;
          }
        }
      }
    }));

    // Update chart series
    setSeries([
      {
        name: `${dataKey}`,
        type: 'area',
        data: chartData.map((item) => item[dataKey] || 0)
      },
      {
        name: 'price',
        type: 'line',
        data: chartData.map((item) => item.idx_price)
      }
    ]);
  }, [chartData, dataKey, chartColor, line, secondary]);

  return <ReactApexChart options={options} series={series} type="area" height={450} />;
};

BalanceChart.propTypes = {
  chartData: PropTypes.arrayOf(
    PropTypes.shape({
      day: PropTypes.string.isRequired,
      idx_price: PropTypes.number.isRequired
    })
  ).isRequired,
  dataKey: PropTypes.string.isRequired
};

export default BalanceChart;
