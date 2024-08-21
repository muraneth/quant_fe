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

const AraeChart2 = () => {
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
          contract_address: '0x8ed97a637a790be1feff5e888d43629dc05408f6',
          wallet_address: '0xcb2116dC5C94a47A1493dC70208eE41C1237b6CD'.toLowerCase()
        };
        const formattedStartDate = startDate.toISOString().slice(0, 10);

        const token = localStorage.getItem('token');
        const uid = localStorage.getItem('uid');

        const response = await axios.post(`http://127.0.0.1:5005/api/data/getWalletDailyInfo`, postData, {
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

  // useEffect(() => {
  //   userDailyCashFlowData.slice(-1)[0]?.acum_pnl_ratio < 0 ? setChartColor([orange[500]]) : setChartColor([green[500]]);
  // }, [userDailyCashFlowData]);

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
              return val;
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
            return val;
          }
        }
      }
    }));
  }, [userDailyCashFlowData, chartColor]);

  const [series, setSeries] = useState([]);

  useEffect(() => {
    setSeries([
      {
        name: 'token balance',
        data: userDailyCashFlowData.map((item) => item.balance)
      },
      {
        name: 'token balance usd',
        data: userDailyCashFlowData.map((item) => item.balance_usd)
      }
    ]);
  }, [userDailyCashFlowData]);

  return <ReactApexChart options={options} series={series} type="area" height={450} />;
};

AraeChart2.propTypes = {
  slot: PropTypes.string
};

export default AraeChart2;
