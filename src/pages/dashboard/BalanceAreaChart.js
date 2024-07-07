import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';

// third-party
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';

import { green, common } from '@mui/material/colors';

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
    strokeDashArray: 0
  }
};

// ==============================|| INCOME AREA CHART ||============================== //

const BalanceAraeChart = ({ slot }) => {
  const theme = useTheme();

  const line = theme.palette.divider;

  const [options, setOptions] = useState(areaChartOptions);

  const [userDailyCashFlowData, setUserDailyCashFlowData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const startDate = new Date();
        // const endDate = new Date();
        if (slot === 'month') {
          startDate.setDate(startDate.getDate() - 30);
        }
        if (slot === 'month3') {
          startDate.setDate(startDate.getDate() - 90);
        }
        if (slot === 'all') {
          startDate.setFullYear(2024, 0, 1);
        }

        // Formatting dates to 'YYYY-MM-DD' string format
        const formattedStartDate = startDate.toISOString().slice(0, 10);
        // const formattedEndDate = endDate.toISOString().slice(0, 10);
        const token = localStorage.getItem('token');
        const uid = localStorage.getItem('uid');
        const response = await axios.get(
          `https://matrixcipher.com/api/user/asset/getAllHistoryCashFlow?uid=${uid}&startDate=${formattedStartDate}`,
          {
            headers: {
              Authorization: `${token}`,
              Uid: `${uid}`
            }
          }
        );
        setUserDailyCashFlowData(response.data.data.daily_cash_flow);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [slot]);

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      colors: [green[700]],
      xaxis: {
        categories: userDailyCashFlowData.map((item) => item.date),

        axisBorder: {
          show: true,
          color: line
        },
        labels: {
          style: {
            colors: 'gray'
          }
        },
        tickAmount: slot === 'all' ? 20 : slot === 'month' ? 11 : 7
      },
      yaxis: {
        labels: {
          style: {
            colors: 'gray'
          }
        }
      },
      grid: {
        borderColor: '#445661'
      },
      tooltip: {
        theme: 'dark'
      }
    }));
  }, [userDailyCashFlowData, slot]);

  const [series, setSeries] = useState([]);

  useEffect(() => {
    setSeries([
      {
        name: 'Balance',
        data: userDailyCashFlowData.map((item) => item.balance)
      }
    ]);
  }, [userDailyCashFlowData]);

  return <ReactApexChart options={options} series={series} type="area" height={450} />;
};

BalanceAraeChart.propTypes = {
  slot: PropTypes.string
};

export default BalanceAraeChart;
