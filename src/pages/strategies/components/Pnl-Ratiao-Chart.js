import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';

// third-party
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';
import { common, green } from '@mui/material/colors';

import ApexCharts from 'apexcharts';

// ==============================|| INCOME AREA CHART ||============================== //

const PnlRatioChart = ({ slot, product, showDetail, showGrid, strokeWidth = 1 }) => {
  const theme = useTheme();

  // const { secondary } = theme.palette.text;
  const line = theme.palette.divider;

  const [options, setOptions] = useState({});

  const [productDailyInfo, setProductDailyInfo] = useState([]);

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
          startDate.setFullYear(startDate.getFullYear() - 10);
        }

        // Formatting dates to 'YYYY-MM-DD' string format
        const formattedStartDate = startDate.toISOString().slice(0, 10);

        const token = localStorage.getItem('token');
        const uid = localStorage.getItem('uid');

        const url = `http://matrixcipher.com/api/product/getSharePriceHistory?product=${product}&start_date=${formattedStartDate}`;

        const response = await axios.get(url, {
          headers: {
            Authorization: `${token}`,
            Uid: `${uid}`
          }
        });
        setProductDailyInfo(response.data.data ? response.data.data : []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [slot]);

  useEffect(() => {
    setOptions(() => ({
      // colors: [green[500]],
      chart: {
        id: 'my-chart',
        type: 'area',
        toolbar: {
          show: false
        }
        // events: {
        //   mounted: (chartContext, config) => {
        //     setTimeout(() => {
        //       const apexChart = new ApexCharts(document.querySelector('#my-chart'), chartOptions);
        //       // Simulate mouse move event to show the tooltip
        //       apexChart.tooltip.show({ seriesIndex: 0, dataPointIndex: 0 });
        //     }, 300);
        //   }
        // }
      },
      stroke: {
        curve: 'smooth',
        width: strokeWidth
      },
      dataLabels: {
        enabled: false
      },
      colors: ['#9AE4A7'],

      xaxis: {
        show: showDetail,
        categories: productDailyInfo?.map((item) => item.date),

        axisBorder: {
          show: showDetail,
          color: line
        },
        labels: {
          show: showDetail,
          style: {
            colors: common.white
          }
        },
        axisTicks: {
          show: showDetail
        },
        tickAmount: slot === 'all' ? 20 : slot === 'month' ? 11 : 7
      },
      yaxis: {
        show: showDetail,
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
        show: showGrid,
        strokeDashArray: 0,
        borderColor: '#445661'
      },
      tooltip: {
        enabled: showDetail,
        theme: 'dark'
      }
    }));
  }, [productDailyInfo]);

  const [series, setSeries] = useState([]);

  useEffect(() => {
    setSeries([
      {
        name: 'PNL Ratio',
        data: productDailyInfo?.map((item) => item.acum_pnl_ratio)
      }
    ]);
  }, [productDailyInfo]);

  return <ReactApexChart options={options} series={series} type="area" height={'100%'} />;
};

PnlRatioChart.propTypes = {
  slot: PropTypes.string
};

export default PnlRatioChart;
