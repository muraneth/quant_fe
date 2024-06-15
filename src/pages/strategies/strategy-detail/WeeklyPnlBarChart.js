/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import { green, red, common } from '@mui/material/colors';

const barChartOptions = {
  chart: {
    type: 'bar',
    height: 365,
    toolbar: {
      show: false
    }
  },
  plotOptions: {
    bar: {
      columnWidth: '45%',
      borderRadius: 4
    }
  },
  dataLabels: {
    enabled: false
  }
};

const WeeklyPnlBarChart = ({ productId }) => {
  const theme = useTheme();
  const { primary, error } = theme.palette;

  const [series, setSeries] = useState([]);
  const [options, setOptions] = useState(barChartOptions);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const uid = localStorage.getItem('uid');

        const response = await axios.get(`http://matrixcipher.com/api/product/getWeeklyPnl?product=${productId}`, {
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
    const positiveData = data?.map((item) => (item.pnl_ratio >= 0 ? item.pnl_ratio : 0));
    const negativeData = data?.map((item) => (item.pnl_ratio < 0 ? item.pnl_ratio : 0));

    setSeries([
      { name: 'Weekly PNL+', data: positiveData },
      { name: 'Weekly PNL-', data: negativeData }
    ]);
    setOptions((prevState) => ({
      ...prevState,
      colors: [green[500], error.light],
      xaxis: {
        categories: data?.map((item) => item.date),
        axisBorder: {
          show: true
        },
        axisTicks: {
          show: true
        },
        labels: {
          style: {
            colors: common.white // Set the y-axis label color
          }
        }
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
        borderColor: '#445661'
      },
      tooltip: {
        theme: 'light'
      }
    }));
  }, [data]);

  return (
    <div id="chart">
      <ReactApexChart options={options} series={series} type="bar" height={365} />
    </div>
  );
};

export default WeeklyPnlBarChart;
