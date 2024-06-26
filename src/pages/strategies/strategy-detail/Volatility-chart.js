// src/VolatilityChart.js
import React, { useEffect, useState } from 'react';

import ReactApexChart from 'react-apexcharts';
import { common } from '@mui/material/colors';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';

const VolatilityChart = ({ productSymbol }) => {
  const [data, setData] = useState([]);
  const [options, setOptions] = useState({});
  const theme = useTheme();
  const line = theme.palette.divider;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const uid = localStorage.getItem('uid');

        const response = await axios.get(`https://matrixcipher.com/api/product/getProductRollingVolatility?product=${productSymbol}`, {
          headers: {
            Authorization: `${token}`,
            Uid: `${uid}`
          }
        });
        setData(response.data.data ? response.data.data : []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setOptions(() => ({
      chart: {
        type: 'line',
        toolbar: {
          show: false
        }
      },
      stroke: {
        curve: 'smooth',
        width: 2
      },
      dataLabels: {
        enabled: false
      },
      colors: ['#9AE4A7'],

      xaxis: {
        show: true,
        categories: data?.map((item) => item.date),

        axisBorder: {
          show: true,
          color: line
        },
        labels: {
          show: true,
          style: {
            colors: common.white
          }
        },
        axisTicks: {
          show: true
        },
        tickAmount: 20
      },
      yaxis: {
        show: true,
        labels: {
          style: {
            colors: common.white // Set the y-axis label color
          },
          formatter: function (val) {
            return val + '%'; // Adding '%' symbol to y-axis labels
          }
        }
      },
      grid: {
        show: true,
        strokeDashArray: 0,
        borderColor: '#445661'
      },
      tooltip: {
        enabled: true,
        theme: 'dark'
      }
    }));
  }, [data]);

  const [series, setSeries] = useState([]);

  useEffect(() => {
    setSeries([
      {
        name: 'PNL Ratio',
        data: data?.map((item) => item.value)
      }
    ]);
  }, [data]);

  return <ReactApexChart options={options} series={series} height={'100%'} />;
};

export default VolatilityChart;
