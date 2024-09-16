/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { common, green, orange } from '@mui/material/colors';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';
import { set } from 'lodash';

// chart options
const areaChartOptions = {
  // chart: {
  //   height: 450,
  //   type: 'line',
  //   toolbar: {
  //     show: false
  //   }
  // },
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

const WalletChart = ({ symbol, chart }) => {
  const theme = useTheme();

  const { secondary } = theme.palette.text;
  const line = theme.palette.divider;

  const [options, setOptions] = useState(areaChartOptions);
  const [chartColor, setChartColor] = useState([green[500]]);
  const [chartData, setChartData] = useState([]);

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

  // useEffect(() => {
  //   userDailyCashFlowData.slice(-1)[0]?.acum_pnl_ratio < 0 ? setChartColor([orange[500]]) : setChartColor([green[500]]);
  // }, [userDailyCashFlowData]);

  useEffect(() => {
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
              return val; // Adding '%' symbol to y-axis labels
            }
          }
        },
        {
          opposite: true,
          title: {
            text: 'Series B'
          }
        }
      ],
      grid: {
        borderColor: '#445661'
      },
      tooltip: {
        theme: 'dark',
        y: {
          formatter: function (val) {
            return val + '%'; // Adding '%' symbol after the data
          }
        }
      }
    }));
  }, [chartData, chartColor]);

  const [series, setSeries] = useState([]);

  useEffect(() => {
    setSeries([
      {
        name: chart,
        type: 'area',
        data: chartData.map((item) => item.value)
      },
      {
        name: 'price',
        type: 'line',
        data: chartData.map((item) => item.price)
      }
    ]);
  }, [chartData]);

  return <ReactApexChart options={options} series={series} type="area" height={450} />;
};

WalletChart.propTypes = {
  slot: PropTypes.string
};

export default WalletChart;
