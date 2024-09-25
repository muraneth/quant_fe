/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { common, green, orange } from '@mui/material/colors';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';
import { Switch, FormControlLabel } from '@mui/material';

const SMALL_VALUE = 1e-10; // Small value to replace 0s

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
function isNotSeperatePrice(chart) {
  const items = ['avgCost','dexAvgCost','cexAvgCost'];
  return items.includes(chart);
}

const WalletChart = ({ symbol, chart }) => {
  const theme = useTheme();

  const { secondary } = theme.palette.text;
  const line = theme.palette.divider;

  const [options, setOptions] = useState(areaChartOptions);
  const [chartColor, setChartColor] = useState([green[500]]);
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
        const formattedStartDate = startDate.toISOString().slice(0, 10);

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
    setOptions((prevState) => ({
      ...prevState,
      colors: chartColor,
      xaxis: {
        categories: chartData.map((item) => item.time),

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
          },
          logarithmic: logScale
        },
        isNotSeperatePrice(chart) === false && {
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
          // logarithmic: logScale
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
  }, [chartData, chartColor, logScale]);

  const [series, setSeries] = useState([]);

  useEffect(() => {
    const adjustedData1 = chartData.map((item) => ({
      ...item,
      value: logScale && item.value === 0 ? SMALL_VALUE : item.value
      // price: logScale && item.price === 0 ? SMALL_VALUE : item.price
    }));
    const adjustedData = adjustedData1.map((item) => ({
      ...item,
      value: logScale && item.value > 0 ? Math.log10(item.value) : item.value
      // price: logScale && item.price > 0 ? Math.log10(item.price) : item.price
    }));

    setSeries([
      {
        name: chart,
        type: 'area',
        data: adjustedData.map((item) => item.value)
      },
      {
        name: 'price',
        type: 'line',
        data: adjustedData.map((item) => item.price)
      }
    ]);
  }, [chartData, logScale]);

  return (
    <div>
      {/* Switch for log/linear scale */}
      <FormControlLabel control={<Switch checked={logScale} onChange={() => setLogScale((prev) => !prev)} />} label="Logarithmic Scale" />
      <ReactApexChart options={options} series={series} type="area" height={450} />
    </div>
  );
};

WalletChart.propTypes = {
  slot: PropTypes.string
};

export default WalletChart;
