/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { common, green, orange } from '@mui/material/colors';

// third-party
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';

// chart options
const areaChartOptions = {
  chart: {
    height: 450,
    type: 'area',
    toolbar: {
      show: false
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth',
    width: 1
  },
  grid: {
    strokeDashArray: 0,
    borderColor: '#90A4AE'
  }
};

// ==============================|| INCOME AREA CHART ||============================== //

const MVRVChart = () => {
  const theme = useTheme();

  const { secondary } = theme.palette.text;
  const line = theme.palette.divider;

  const [options, setOptions] = useState(areaChartOptions);
  const [chartColor, setChartColor] = useState([green[500]]);
  const [userDailyCashFlowData, setUserDailyCashFlowData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const startDate = new Date();

        const postData = {
          contract_address: '0x8ed97a637a790be1feff5e888d43629dc05408f6'
        };

        const token = localStorage.getItem('token');
        const uid = localStorage.getItem('uid');

        const response = await axios.post(`http://127.0.0.1:5005/api/data/getSumInfoByToken`, postData, {
          headers: {
            Authorization: `${token}`,
            Uid: `${uid}`
          }
        });

        setUserDailyCashFlowData(response.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      colors: chartColor,
      xaxis: {
        categories: userDailyCashFlowData.map((item) => item.day),

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
            return val; // Adding '%' symbol after the data
          }
        }
      }
    }));
  }, [userDailyCashFlowData, chartColor]);

  const [series, setSeries] = useState([]);

  useEffect(() => {
    setSeries([
      {
        name: 'MVRV',
        type: 'area',
        data: userDailyCashFlowData.map((item) => item.mvrv)
      },
      {
        name: 'price',
        type: 'area',
        data: userDailyCashFlowData.map((item) => item.idx_price)
      }
    ]);
  }, [userDailyCashFlowData]);

  return <ReactApexChart options={options} series={series} type="area" height={450} />;
};

MVRVChart.propTypes = {
  slot: PropTypes.string
};

export default MVRVChart;
