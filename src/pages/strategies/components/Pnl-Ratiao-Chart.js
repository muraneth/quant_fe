import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';

// third-party
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';
import { common, green } from '@mui/material/colors';

// ==============================|| INCOME AREA CHART ||============================== //

const PnlRatioChart = ({ slot, product, showDetail, showGrid, strokeWidth = 1, showBtc = false }) => {
  const theme = useTheme();

  // const { secondary } = theme.palette.text;
  const line = theme.palette.divider;
  const { error } = theme.palette;

  const [options, setOptions] = useState({});

  const [productData, setProductData] = useState([]);
  const [btcPnlData, setBtcPnlData] = useState([]);

  const [series, setSeries] = useState([]);

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
          // startDate.setFullYear(startDate.getDate() - 1);
          startDate.setFullYear(2024, 0, 1);
        }

        // Formatting dates to 'YYYY-MM-DD' string format
        const formattedStartDate = startDate.toISOString().slice(0, 10);

        const token = localStorage.getItem('token');
        const uid = localStorage.getItem('uid');

        const url = `https://myquant.financial/api/product/getSharePriceHistory?product=${product}&start_date=${formattedStartDate}`;

        const response = await axios.get(url, {
          headers: {
            Authorization: `${token}`,
            Uid: `${uid}`
          }
        });
        setProductData(response.data.data ? response.data.data : []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [slot]);

  useEffect(() => {
    if (showBtc) {
      const fetchData = async () => {
        const token = localStorage.getItem('token');
        const uid = localStorage.getItem('uid');
        const startDate = productData[0]?.date;
        if (startDate === undefined) {
          return;
        }

        const btcResponse = await axios.get(`https://myquant.financial/api/common/getBTCPNLRatio?&start_date=${startDate}`, {
          headers: {
            Authorization: `${token}`,
            Uid: `${uid}`
          }
        });
        setBtcPnlData(btcResponse.data.data ? btcResponse.data.data : []);
      };
      fetchData();
    }
  }, [productData]);

  useEffect(() => {
    setOptions(() => ({
      // colors: [green[500]],
      chart: {
        id: 'my-chart',
        type: 'area',
        toolbar: {
          show: false
        }
      },
      // title: {
      //   text: 'Acum Pnl Ratio',
      //   align: 'left'
      // },
      stroke: {
        curve: 'smooth',
        width: strokeWidth
      },
      dataLabels: {
        enabled: false
      },
      // colors: ['#9AE4A7', '#BB86FC'],
      colors: [green[500], error.light],

      xaxis: {
        show: showDetail,
        categories: productData?.map((item) => item.date),

        axisBorder: {
          show: showDetail,
          color: line
        },
        labels: {
          show: showDetail,
          style: {
            colors: 'gray'
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
            colors: 'gray'
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
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        floating: true,
        offsetY: -5,
        offsetX: -5,
        labels: {
          colors: 'gray' // Set the legend text color here
        }
      }
    }));
  }, [productData, btcPnlData, showDetail, showGrid, strokeWidth]);

  useEffect(() => {
    const padArray = (arr, length) => {
      while (arr.length < length) {
        arr.push(null);
      }
      return arr;
    };

    const maxLength = Math.max(productData.length, btcPnlData.length);

    const paddedProductData = padArray([...productData], maxLength);
    const paddedBtcPnlData = padArray([...btcPnlData], maxLength);

    if (!showBtc) {
      setSeries([
        {
          name: 'Strategy PNL Ratio',
          data: paddedProductData?.map((item) => (item ? item.acum_pnl_ratio : null))
        }
      ]);
    } else {
      setSeries([
        {
          name: 'Strategy PNL Ratio',
          data: paddedProductData?.map((item) => (item ? item.acum_pnl_ratio : null))
        },
        {
          name: 'BTC PNL Ratio',
          data: paddedBtcPnlData?.map((item) => (item ? item.value : null))
        }
      ]);
    }
  }, [productData, btcPnlData, showBtc]);

  return <ReactApexChart options={options} series={series} type="area" height={'100%'} />;
};

PnlRatioChart.propTypes = {
  slot: PropTypes.string,
  product: PropTypes.string.isRequired,
  showDetail: PropTypes.bool,
  showGrid: PropTypes.bool,
  strokeWidth: PropTypes.number,
  showBtc: PropTypes.bool
};

export default PnlRatioChart;
