/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import { green, red, common } from '@mui/material/colors';

const chartOptions = {
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
  }
};

const SharpeRatioChart = ({ productSymbol }) => {
  const theme = useTheme();
  const { primary, error } = theme.palette;

  const [series, setSeries] = useState([]);
  const [options, setOptions] = useState(chartOptions);
  const [data, setData] = useState([]);
  const [btcData, setBtcData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const uid = localStorage.getItem('uid');

        const response = await axios.get(`https://matrixcipher.com/api/product/getRollingSharpeRatio?product=${productSymbol}`, {
          headers: {
            Authorization: `${token}`,
            Uid: `${uid}`
          }
        });

        const btcResponse = await axios.get('https://matrixcipher.com/api/common/getBTCSharpeRatio', {
          headers: {
            Authorization: `${token}`,
            Uid: `${uid}`
          }
        });

        setData(response.data.data ? response.data.data : []);
        setBtcData(btcResponse.data.data ? btcResponse.data.data : []);
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

    setSeries([
      { name: 'Sharpe Ratio', data: data.map((item) => (item ? item.value : null)) },
      { name: 'BTC Sharpe Ratio', data: btcData.map((item) => (item ? item.value : null)) }
    ]);
    setOptions((prevState) => ({
      // ...prevState,
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
      colors: [green[500], error.light],
      xaxis: {
        categories: btcData?.map((item) => item.key),
        axisBorder: {
          show: true
        },
        axisTicks: {
          show: true
        },
        labels: {
          style: {
            colors: 'gray'
          }
        }
      },
      yaxis: {
        show: true,
        labels: {
          style: {
            colors: 'gray'
          }
          //   formatter: function (val) {
          //     return val + '%'; // Adding '%' symbol to y-axis labels
          //   }
        }
      },
      grid: {
        borderColor: '#445661'
      },
      tooltip: {
        theme: 'dark'
      },
      legend: {
        labels: {
          colors: 'gray'
        }
      }
    }));
  }, [data]);

  return (
    <div id="chart">
      <ReactApexChart options={options} series={series} height={365} />
    </div>
  );
};

export default SharpeRatioChart;
