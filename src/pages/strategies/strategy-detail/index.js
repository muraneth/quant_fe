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
import DepositCryptoPopup from '../../invest/deposit';

const StrategyDetail = () => {
  const [productInfo, setProductInfo] = useState({});
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

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3, minHeight: '100vh' }}>
      {/* <Container>
        <Button variant="contained" color="primary" onClick={handleOpenPopup}>
          Open Deposit Popup
        </Button>
        <DepositCryptoPopup open={isPopupOpen} handleClose={handleClosePopup} />
      </Container> */}

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
              <Grid item container direction="row" justifyContent="space-evenly">
                <Grid alignItems="center">
                  <Typography variant="body3">APY : </Typography>
                  <Typography variant="h5" color="primary">
                    {productInfo.apy}%
                  </Typography>
                </Grid>
                <Grid alignItems="center">
                  <Typography variant="body3">SharpeRatio : </Typography>
                  <Typography variant="h5" color="primary">
                    {productInfo.sharpe_ratio}
                  </Typography>
                </Grid>
                <Grid alignItems="center">
                  <Typography variant="body3">MaxDownDraw : </Typography>
                  <Typography variant="h5" color="primary">
                    {productInfo.mdd}%
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
                    // bgcolor: '#4caf50',
                    // color: '#fff',
                    '&:hover': { bgcolor: '#388e3c' }
                  }}
                  onClick={handleOpenPopup}
                >
                  Invest
                </Button>
              </Box>
            </CardContent>
          </MainCard>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5" component="div">
            Acum Pnl Ratio
          </Typography>

          <MainCard sx={{ minWidth: 275, bgcolor: '#1e1e2d', m: 2 }}>
            {/* <Box sx={{ pt: 1, pr: 2 }}> */}

            <AcumPnlRatioAraeChart productId={id} />
            {/* </Box> */}
          </MainCard>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5" component="div">
            Weekly Profit Ratio Bar
          </Typography>
          <MainCard sx={{ minWidth: 275, bgcolor: '#1e1e2d', m: 2 }}>
            <CardContent>
              <WeeklyPnlBarChart productId={id} />
            </CardContent>
          </MainCard>
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
          <MainCard sx={{ minWidth: 275, bgcolor: '#1e1e2d', color: '#fff', m: 2 }}>
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
