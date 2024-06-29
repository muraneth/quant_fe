import { Box, Grid, Divider, Stack, CardContent, Typography, Button, Container } from '@mui/material';

import axios from 'axios';
import PnlRatioChart from '../components/Pnl-Ratiao-Chart';
import { useState, useEffect } from 'react';
import moment from 'moment';
import { get } from 'lodash';

const getTitleBySlot = (slot) => {
  switch (slot) {
    case 'all':
      return 'All Time';
    case 'month3':
      return '3 Months';
    case 'month':
      return '1 Month';
    default:
      return 'All Time';
  }
};
const getTimeBySlot = (slot) => {
  switch (slot) {
    case 'all':
      return '2021-01-01';
    case 'month3':
      return moment().subtract(3, 'months').format('YYYY-MM-DD');
    case 'month':
      return moment().subtract(1, 'months').format('YYYY-MM-DD');
    default:
      return '2021-01-01';
  }
};

const MainArea = ({ productSymbol }) => {
  const [productInfo, setProductInfo] = useState({});
  const [slot, setSlot] = useState('all');
  const host = 'https://matrixcipher.com';
  useEffect(() => {
    const fetchProduct = async () => {
      var startDate = getTimeBySlot(slot);

      const url = `${host}/api/product/getProductBaseById?product=${productSymbol}&start_date=${startDate}`;
      try {
        const response = await axios.get(url);
        setProductInfo(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProduct();
  }, [productSymbol, slot]);
  const handleInvest = () => {
    setIsInvestPopOpen(true);
  };

  return (
    <Grid container xs={12} sx={{ color: '#0b1836' }} justifyContent="space-between">
      <Grid container xs={12} justifyContent="center" alignItems="center" py={2}>
        <Box>
          <Button
            size="small"
            onClick={() => setSlot('all')}
            color={slot === 'all' ? 'primary' : 'secondary'}
            // variant={slot === 'all' ? 'outlined' : 'text'}
            variant="outlined"
          >
            ALL
          </Button>
          <Button
            size="small"
            onClick={() => setSlot('month3')}
            color={slot === 'month3' ? 'primary' : 'secondary'}
            // variant={slot === 'month3' ? 'outlined' : 'text'}
            variant="outlined"
          >
            3Month
          </Button>
          <Button size="small" onClick={() => setSlot('month')} color={slot === 'month' ? 'primary' : 'secondary'} variant="outlined">
            Month
          </Button>
        </Box>
      </Grid>

      <Grid item xs={8} container>
        <Box
          sx={(theme) => ({
            // mt: { xs: 8, sm: 10 },
            alignSelf: 'center',
            height: { xs: 200, sm: 200, md: 300, lg: 400 },
            width: '100%'
          })}
        >
          <Grid container xs={12} justifyContent="center" alignItems="center">
            <Typography variant="h6" sx={{ color: '#fff' }}>
              Acum Pnl Ratio
            </Typography>
          </Grid>
          <PnlRatioChart slot={slot} product={productSymbol} showDetail={true} showGrid={true} showBtc={true} />
        </Box>
      </Grid>
      <Grid item xs={4} container>
        <Grid item xs={12} container direction="row" justifyContent="space-evenly" color="gray">
          <Typography variant="h4">Data in {getTitleBySlot(slot)} </Typography>
        </Grid>
        <Grid item xs={12} container direction="row" justifyContent="space-evenly" color="gray">
          <Grid alignItems="center" height="20%">
            <Typography variant="body3">APY : </Typography>
            <Typography variant="h5" color="green.main" pt={1}>
              {productInfo?.apy}%
            </Typography>
          </Grid>
          <Grid alignItems="center">
            <Typography variant="body3">PnlRatio : </Typography>
            <Typography variant="h5" color="green.main" pt={1}>
              {productInfo?.pnl_ratio}%
            </Typography>
          </Grid>
          <Grid alignItems="center">
            <Typography variant="body3">MaxDownDraw : </Typography>

            <Typography variant="h5" color="error.main" pt={1}>
              -{productInfo?.mdd}%
            </Typography>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Divider sx={{ my: 1, borderColor: 'gray', width: '80%' }} />
          </Box>
        </Grid>

        <Grid item xs={12} container direction="row" justifyContent="space-evenly" color="gray">
          <Grid alignItems="center">
            <Typography variant="body3">Trade Count : </Typography>
            <Typography variant="h5" color="green.main" pt={2}>
              {productInfo?.trade_count}
            </Typography>
          </Grid>
          <Grid alignItems="center">
            <Typography variant="body3">Win Rate : </Typography>
            <Typography variant="h5" color="green.main" pt={2}>
              {productInfo?.win_ratio}%
            </Typography>
          </Grid>
          <Grid alignItems="center">
            <Typography variant="body3">Reward Risk Ratio : </Typography>
            <Typography variant="h5" color="green.main" pt={2}>
              {productInfo?.profit_ratio}
            </Typography>
          </Grid>
        </Grid>
        {/* <Grid item xs={12} container direction="row" justifyContent="space-evenly" color="gray">
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
        </Grid> */}
      </Grid>
    </Grid>
  );
};

export default MainArea;
