import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';

// third-party
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';
import { common } from '@mui/material/colors';

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
    width: 2
  },
  grid: {
    strokeDashArray: 0
  }
};

// ==============================|| INCOME AREA CHART ||============================== //

const AcumPnlRatioAraeChart = ({ productId }) => {
  const theme = useTheme();

  // const { secondary } = theme.palette.text;
  const line = theme.palette.divider;

  const [options, setOptions] = useState(areaChartOptions);

  const [productDailyInfo, setProductDailyInfo] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const uid = localStorage.getItem('uid');

        const response = await axios.get(`http://matrixcipher.com/api/product/getWeeklyPnl?productId=${productId}`, {
          headers: {
            Authorization: `${token}`,
            Uid: `${uid}`
          }
        });
        setProductDailyInfo(response.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      colors: [theme.palette.primary.main, theme.palette.primary[700]],
      xaxis: {
        categories: productDailyInfo?.map((item) => item.date),

        axisBorder: {
          show: true,
          color: line
        },
        labels: {
          style: {
            colors: common.white
          }
        }
        // tickAmount: slot === 'all' ? 20 : slot === 'month' ? 11 : 7
      },
      yaxis: {
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
        borderColor: line
      },
      tooltip: {
        theme: 'light',

        y: {
          formatter: function (val) {
            return val + '%'; // Adding '%' symbol after the data
          }
        }
      }
    }));
  }, [productDailyInfo]);

  const [series, setSeries] = useState([]);

  useEffect(() => {
    setSeries([
      {
        name: 'Acum PNL Ratio',
        data: productDailyInfo?.map((item) => item.acum_pnl_ratio)
      }
    ]);
  }, [productDailyInfo]);

  return <ReactApexChart options={options} series={series} type="area" height={450} />;
};

AcumPnlRatioAraeChart.propTypes = {
  slot: PropTypes.string
};

export default AcumPnlRatioAraeChart;
