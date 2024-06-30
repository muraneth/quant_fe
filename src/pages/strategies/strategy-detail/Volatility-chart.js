// src/VolatilityChart.js
import React, { useEffect, useState } from 'react';

import ReactApexChart from 'react-apexcharts';
import { green, red, common } from '@mui/material/colors';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';

const VolatilityChart = ({ productSymbol }) => {
  const [data, setData] = useState([]);
  const [btcData, setBtcData] = useState([]);
  const [options, setOptions] = useState({});
  const theme = useTheme();

  const { primary, error } = theme.palette;
  const line = theme.palette.divider;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const uid = localStorage.getItem('uid');

        const response = await axios.get(`https://myquant.financial/api/product/getProductRollingVolatility?product=${productSymbol}`, {
          headers: {
            Authorization: `${token}`,
            Uid: `${uid}`
          }
        });

        const btcResponse = await axios.get('https://myquant.financial/api/common/getBTCVolatility', {
          headers: {
            Authorization: `${token}`,
            Uid: `${uid}`
          }
        });
        setData(response.data.data ? response.data.data.slice(0, -1) : []);
        setBtcData(btcResponse.data.data ? [...btcResponse.data.data] : []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const uid = localStorage.getItem('uid');

        // let startDate = data[0]?.key;
        // if (startDate === undefined) {
        //   return;
        // }

        const btcResponse = await axios.get(`https://myquant.financial/api/common/getBTCVolatility?start_date=${startDate}`, {
          headers: {
            Authorization: `${token}`,
            Uid: `${uid}`
          }
        });

        setBtcData(btcResponse.data.data ? [...btcResponse.data.data] : []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const padArrayAhead = (arr, length) => {
      while (arr.length < length) {
        arr.unshift(null);
      }
      return arr;
    };

    if (btcData.length > data.length) {
      padArrayAhead(data, btcData.length);
    }

    setOptions(() => ({
      chart: {
        type: 'line',
        toolbar: {
          show: false
        }
      },
      stroke: {
        curve: 'smooth',
        width: 1
      },
      dataLabels: {
        enabled: false
      },
      // colors: ['#9AE4A7'],
      // colors: ['#9AE4A7', '#BB86FC'],
      colors: [green[500], error.light],

      xaxis: {
        show: true,
        categories: btcData?.map((item) => item.key),

        axisBorder: {
          show: true,
          color: line
        },
        labels: {
          show: true,
          style: {
            colors: 'gray'
          }
        },
        axisTicks: {
          show: true
        },
        tickAmount: 24
      },
      yaxis: {
        show: true,
        labels: {
          style: {
            colors: 'gray'
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
      },
      legend: {
        labels: {
          colors: 'gray'
        }
      }
    }));
  }, [data, line, btcData]);

  const [series, setSeries] = useState([]);

  useEffect(() => {
    setSeries([
      {
        name: 'Strategy Volatility',
        data: data?.map((item) => (item ? item.value : null))
      },
      {
        name: 'BTC Volatility',
        data: btcData?.map((item) => (item ? item.value : null))
        // color: '#BB86FC'
      }
    ]);
  }, [data, btcData]);

  return <ReactApexChart options={options} series={series} height={'300'} />;
};

export default VolatilityChart;
