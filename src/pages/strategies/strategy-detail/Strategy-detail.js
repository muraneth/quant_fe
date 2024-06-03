/* eslint-disable no-unused-vars */

import { Box, Grid, Paper, Card, CardContent, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

import { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import MainCard from 'components/MainCard';
import TradeTable from './TradesTable';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { set } from 'lodash';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary
}));

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

const StrategyDetail = () => {
  const [slot, setSlot] = useState('month');
  const [series, setSeries] = useState([{}]);
  const [productInfo, setProductInfo] = useState({});
  const { id } = useParams();
  console.log(id);

  const host = 'http://matrixcipher.com';

  useEffect(() => {
    const fetchProduct = async () => {
      const url = `${host}/api/product/getInfoById?productId=${id}`;
      try {
        const response = await axios.get(url);
        setProductInfo(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProduct();
    const fetchProductHistory = async () => {
      const url = `${host}/api/product/getSharePriceHistory?productId=${id}`;
      try {
        const response = await axios.get(url);
        if (response.data.data.length === 0) {
          return;
        }
        setSeries(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProductHistory();
  }, []);

  const handleButtonClick = () => {};

  return (
    <Box sx={{ flexGrow: 1, p: 3, minHeight: '100vh' }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <MainCard sx={{ minWidth: 275, bgcolor: '#1e1e2d', color: '#fff', m: 2 }}>
            <CardContent>
              <Typography variant="h5" component="div">
                Myquant-alpha 1x
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                Quickly enter and exit XMR/USDT, MKR/USDT and TRX/USDT markets using dollar cost averaging with up to 6 entries followed by
                a take profit of 0.7%. Each entry uses 5% of the portfolio and is signaled when the RSI value is bellow 50.
              </Typography>
              {/* <RiskBar value={strategy.risk} /> */}
              <Typography variant="body2" sx={{ mt: 2 }}>
                Last month: 60%
              </Typography>
              <Typography variant="body2">Last 6 months: {productInfo.lastSixMonths || 'N/A'}</Typography>
              <Typography variant="body2">Min. Investment:100</Typography>
              <Typography variant="body2">Trade Count: {productInfo.tradeCount || 'N/A'}</Typography>
              <Typography variant="body2">Win Ratio: {productInfo.winRatio || 'N/A'}</Typography>

              {/* <Button variant="contained" sx={{ mt: 2 }} onClick={handleButtonClick}>
                Invest
              </Button> */}
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
                <Button
                  variant="contained"
                  sx={{
                    width: '150px', // Adjust the width as needed
                    height: '50px', // Adjust the height as needed
                    // bgcolor: '#4caf50',
                    // color: '#fff',
                    '&:hover': { bgcolor: '#388e3c' }
                  }}
                  onClick={handleButtonClick}
                >
                  Invest
                </Button>
              </Box>
            </CardContent>
          </MainCard>
        </Grid>
        <Grid item xs={12}>
          <MainCard sx={{ minWidth: 275, bgcolor: '#1e1e2d', color: '#fff', m: 2 }}>
            {/* <Box sx={{ pt: 1, pr: 2 }}> */}
            <ReactApexChart options={areaChartOptions} series={series} type="area" height={450} />
            {/* </Box> */}
          </MainCard>
        </Grid>
        <Grid item xs={8}>
          <MainCard sx={{ mt: 2 }} content={false}>
            <TradeTable />
          </MainCard>
        </Grid>
        <Grid item xs={4}>
          <MainCard sx={{ minWidth: 275, bgcolor: '#1e1e2d', color: '#fff', m: 2 }}>
            <CardContent>
              <Typography variant="h5" component="div">
                Last 3 month Token Info{' '}
              </Typography>
              <Typography variant="body2">Solana: [ win-ratia 64%] [profit-ratio 1.7] count 110</Typography>
              <Typography variant="body2">Pepe: [ win-ratia 54%] [profit-ratio 1.6] </Typography>
              <Typography variant="body2">ETH: [ win-ratia 54%] [profit-ratio 1.6] </Typography>
            </CardContent>
          </MainCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StrategyDetail;
