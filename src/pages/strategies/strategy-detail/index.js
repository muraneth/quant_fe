/* eslint-disable no-unused-vars */

import { Box, Grid, Paper, Card, CardContent, Typography, Button, Container } from '@mui/material';

import { useState, useEffect } from 'react';
// import ReactApexChart from 'react-apexcharts';
import AcumPnlRatioAraeChart from './Pnl-ratio-area';
import MainCard from 'components/MainCard';
import TradeTable from './TradesTable';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import WeeklyPnlBarChart from './WeeklyPnlBarChart';
import TokenProfitCard from './Token-profit';
import { useNavigate } from 'react-router-dom';
import InvestPopup from '../../invest/Invest-popup';

const StrategyDetail = () => {
  const [productInfo, setProductInfo] = useState({});
  const navigate = useNavigate();
  const [isInvestPopOpen, setIsInvestPopOpen] = useState(false);

  const { id } = useParams();
  console.log(id);

  const host = 'http://matrixcipher.com';

  useEffect(() => {
    const fetchProduct = async () => {
      const url = `${host}/api/product/getProductBaseById?productId=${id}`;
      try {
        const response = await axios.get(url);
        setProductInfo(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProduct();
  }, []);

  const handleInvest = () => {
    setIsInvestPopOpen(true);
  };
  const handleClosePopup = () => {
    setIsInvestPopOpen(false);
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3, minHeight: '100vh', bgcolor: '#0b1836', color: '#fff' }}>
      {/* <Container>
        <Button variant="contained" color="green" onClick={handleOpenPopup}>
          Open Deposit Popup
        </Button>
        <DepositCryptoPopup open={isPopupOpen} handleClose={handleClosePopup} />
      </Container> */}
      <InvestPopup open={isInvestPopOpen} handleClose={handleClosePopup} productId={id} />

      <Grid container spacing={2}>
        <Grid item xs={12}>
          {/* <MainCard sx={{ minWidth: 275, bgcolor: '#0b1836', color: '#fff', m: 2 }}> */}
          <CardContent>
            <Typography variant="h5" component="div">
              Myquant-alpha 1x
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              Quickly enter and exit XMR/USDT, MKR/USDT and TRX/USDT markets using dollar cost averaging with up to 6 entries followed by a
              take profit of 0.7%. Each entry uses 5% of the portfolio and is signaled when the RSI value is bellow 50.
            </Typography>
            {/* <RiskBar value={strategy.risk} /> */}
            <Grid item container direction="row" justifyContent="space-evenly">
              <Grid alignItems="center">
                <Typography variant="body3">APY : </Typography>
                <Typography variant="h5" color="green">
                  {productInfo.apy}%
                </Typography>
              </Grid>
              <Grid alignItems="center">
                <Typography variant="body3">SharpeRatio : </Typography>
                <Typography variant="h5" color="green">
                  {productInfo.sharpe_ratio}
                </Typography>
              </Grid>
              <Grid alignItems="center">
                <Typography variant="body3">MaxDownDraw : </Typography>
                <Typography variant="h5" color="error">
                  -{productInfo.mdd}%
                </Typography>
              </Grid>
            </Grid>

            <Grid container alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography variant="h5" sx={{ mt: 2 }}>
                  Data In 1 Month
                </Typography>
                <Typography variant="body2">Trade Count: {productInfo?.one_month_static?.trade_count || 'N/A'}</Typography>
                <Typography variant="body2">PNL Ratio: {productInfo?.one_month_static?.pnl_ratio || 'N/A'}%</Typography>

                <Typography variant="body2">Profit Ratio: {productInfo?.one_month_static?.profit_ratio || 'N/A'}%</Typography>
                <Typography variant="body2">Win Ratio: {productInfo?.one_month_static?.win_ratio || 'N/A'}%</Typography>
              </Grid>
              <Grid item>
                <Typography variant="h5" sx={{ mt: 2 }}>
                  Data In 3 Month
                </Typography>
                <Typography variant="body2">Trade Count: {productInfo?.thr_month_static?.trade_count || 'N/A'}</Typography>
                <Typography variant="body2">PNL Ratio: {productInfo?.thr_month_static?.pnl_ratio || 'N/A'}%</Typography>
                <Typography variant="body2">Profit Ratio: {productInfo?.thr_month_static?.profit_ratio || 'N/A'}%</Typography>
                <Typography variant="body2">Win Ratio: {productInfo?.thr_month_static?.win_ratio || 'N/A'}%</Typography>
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
              <Button
                variant="contained"
                sx={{
                  width: '150px', // Adjust the width as needed
                  height: '50px', // Adjust the height as needed
                  bgcolor: '#4caf50',
                  // color: '#fff',
                  '&:hover': { bgcolor: '#388e3c' }
                }}
                onClick={handleInvest}
              >
                Invest
              </Button>
            </Box>
          </CardContent>
          {/* </MainCard> */}
        </Grid>
        <Grid item xs={12} sx={{ color: '#0b1836' }}>
          <Typography variant="h5" component="div" sx={{ color: '#fff' }}>
            Acum Pnl Ratio
          </Typography>

          <AcumPnlRatioAraeChart productId={id} />
        </Grid>
        <Grid item xs={12} sx={{ color: '#0b1836' }}>
          <Typography variant="h5" component="div" sx={{ color: '#fff' }}>
            Weekly Profit Ratio Bar
          </Typography>
          {/* <MainCard sx={{ minWidth: 275, bgcolor: '#0b1836', m: 2 }}> */}
          {/* <CardContent> */}
          <WeeklyPnlBarChart productId={id} />
          {/* </CardContent> */}
          {/* </MainCard> */}
        </Grid>
        <Grid item xs={8}>
          <Typography variant="h5" component="div">
            Last 3 Months Trades
          </Typography>
          <MainCard sx={{ mt: 2 }}>
            <CardContent>
              <TradeTable productId={id} />
            </CardContent>
          </MainCard>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="h5" component="div">
            Last 3 Months Profit By Token{' '}
          </Typography>
          <MainCard sx={{ minWidth: 275, bgcolor: '#0b1836', color: '#fff', m: 2 }}>
            <CardContent>
              <TokenProfitCard productId={id} />
            </CardContent>
          </MainCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StrategyDetail;
