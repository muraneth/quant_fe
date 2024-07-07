/* eslint-disable no-unused-vars */

import { Box, Grid, Paper, Divider, Stack, CardContent, Typography, Button, Container } from '@mui/material';
import { styled } from '@mui/material/styles';

import { useState, useEffect } from 'react';
import MainCard from 'components/MainCard';
import TradeTable from './TradesTable';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import WeeklyPnlBarChart from './WeeklyPnlBarChart';
import TokenProfitCard from './Token-profit';
import { useNavigate } from 'react-router-dom';
import InvestPopup from '../../invest/Invest-popup';
import StrategySummary from './Summary';

import Header from 'layout/MainLayout/Header/index';
import PnlRatioChart from '../components/Pnl-Ratiao-Chart';
import SharpeRatioChart from './Sharpe-ratio-chart';
import ProfitLoseBarChart from './Profit-lose-chart';
import VolatilityChart from './Volatility-chart';
import MainArea from './Main-area';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary
}));

const StrategyDetail = () => {
  const [productInfo, setProductInfo] = useState({});
  const navigate = useNavigate();
  const [isInvestPopOpen, setIsInvestPopOpen] = useState(false);
  const [slot, setSlot] = useState('all');

  const host = 'https://matrixcipher.com';
  const { id } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      const url = `${host}/api/product/getProductBaseById?product=${id}`;
      try {
        const response = await axios.get(url);
        setProductInfo(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProduct();
  }, [id]);

  const handleInvest = () => {
    setIsInvestPopOpen(true);
  };
  const handleClosePopup = () => {
    setIsInvestPopOpen(false);
  };

  return (
    <Box
      alignItems="center"
      width="100%"
      sx={{
        flexGrow: 1,
        p: 10,
        minHeight: '100vh',
        color: '#fff',

        backgroundRepeat: 'no-repeat',
        backgroundImage: 'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 16%), transparent)',
        pb: { xs: 12, sm: 0 }
      }}
    >
      <Header />
      {/* <Container>
        <Button variant="contained" color="green" onClick={handleOpenPopup}>
          Open Deposit Popup
        </Button>
        <DepositCryptoPopup open={isPopupOpen} handleClose={handleClosePopup} />
      </Container> */}
      <InvestPopup open={isInvestPopOpen} handleClose={handleClosePopup} product={id} />

      <Grid container spacing={5}>
        <Grid item xs={12} container>
          <Grid item xs={6} container>
            <Typography variant="h4" component="div">
              {productInfo?.name}
            </Typography>
          </Grid>
          <Grid item xs={6} container justifyContent="flex-end">
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
              <Button
                variant="contained"
                sx={{
                  width: '150px', // Adjust the width as needed
                  height: '50px', // Adjust the height as needed
                  bgcolor: 'secondary.main',
                  // color: '#fff',
                  '&:hover': { bgcolor: 'secondary.light' }
                }}
                onClick={handleInvest}
              >
                Invest
              </Button>
            </Box>
          </Grid>
        </Grid>
        <MainArea productSymbol={id} />

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Divider sx={{ my: 1, borderColor: 'gray', width: '80%' }} />
          </Box>
        </Grid>

        <Grid item xs={12}>
          <StrategySummary
            overview="This Strategy primarily engages with cryptocurrency pairs including ETH-USDT, PEPE-USDT, DOGE-USDT, and SOL-USDT, while retaining the flexibility to trade other pairs as market opportunities arise. This strategy is designed with a strong emphasis on risk management and consistent performance. "
            allocation="The strategy employs a structured approach to allocation and risk management. It limits ETH-USDT exposure to a maximum of 50% of total capital, while other pairs are allocated up to 30% each. Leverage, though occasionally surpassing 100% with multiple positions, generally stays below 50%, maintaining a conservative risk profile that balances potential returns with controlled market exposure."
            features="Diversifies  spreads risk across multiple cryptocurrency pairs, flexibility that adapts to market conditions by incorporating additional pairs when advantageous, controlled leverage, which maintains leverage at safe levels, ensuring stability and minimizing risk, and strong performance metrics such as a high Sharpe ratio and low drawdown, indicating effective risk-adjusted returns."
          />
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Divider sx={{ my: 1, borderColor: 'gray', width: '80%' }} />
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Typography variant="h5" component="div">
              Statistics Detail
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sx={{ color: '#0b1836' }}>
          <Typography variant="h5" component="div" sx={{ color: '#fff' }}>
            Weekly Profit Ratio Bar
          </Typography>
          <WeeklyPnlBarChart productId={id} />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5" component="div">
            Rolling 3-months Sharpe Ratio
          </Typography>
          <SharpeRatioChart productSymbol={id} />
        </Grid>
        {/* <Grid item xs={12}>
          <Typography variant="h5" component="div">
            Profit/Lose Bar Chart
          </Typography>
          <ProfitLoseBarChart productSymbol={id} />
        </Grid> */}
        <Grid item xs={12}>
          <Typography variant="h5" component="div">
            Rolling 30-Days Volatility Chart
          </Typography>

          <VolatilityChart productSymbol={id} />
        </Grid>
        <Grid item xs={12} sx={{ color: '#fff' }}>
          <Typography variant="h5" component="div">
            Last 3 Months Trades
          </Typography>
          <MainCard sx={{ minWidth: 275, bgcolor: 'background.paper', color: 'gray', m: 2 }}>
            <CardContent>
              <TradeTable productId={id} />
            </CardContent>
          </MainCard>
        </Grid>
        {/* <Grid item xs={4}>
          <Typography variant="h5" component="div">
            Last 3 Months Profit By Token{' '}
          </Typography>
          <MainCard sx={{ minWidth: 275, bgcolor: '#0b1836', color: '#fff', m: 2 }}>
            <CardContent>
              <TokenProfitCard productId={id} />
            </CardContent>
          </MainCard>
        </Grid> */}
      </Grid>
    </Box>
  );
};

export default StrategyDetail;
