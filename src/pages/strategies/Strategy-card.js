/* eslint-disable no-unused-vars */

import { useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, Typography, Button, LinearProgress, Grid, Item } from '@mui/material';

const StrategyCard = ({ strategy }) => {
  const navigate = useNavigate();

  const handleButtonClick = async () => {
    // navigate to the product page
    navigate(`/dashboard/strategy/${strategy.symbol}`);
  };
  // const handleButtonClick = () => {
  //   // Call the onClick handler with the strategy title
  //   onClick(strategy.id);
  // };
  const RiskBar = ({ value }) => (
    <Box sx={{ width: '100%', mt: 1, bgcolor: '#4caf50' }}>
      <LinearProgress variant="determinate" value={value} />
    </Box>
  );

  return (
    <Card sx={{ minWidth: 275, bgcolor: '#0b1836', color: '#fff', m: 2 }}>
      <CardContent>
        <Typography variant="h3" component="div">
          {strategy.name}
        </Typography>

        <Typography variant="body3">Trading Coins: {strategy.coin_pairs?.join(', ')}</Typography>
        <RiskBar value={strategy.risk} />
        <Grid item>
          <Grid container alignItems="center">
            <Typography variant="body3">APY : </Typography>
            <Typography variant="h5" color="green">
              {strategy.apy}%
            </Typography>
          </Grid>
          <Grid container alignItems="center">
            <Typography variant="body3">SharpeRatio : </Typography>
            <Typography variant="h5" color="green">
              {strategy.sharpe_ratio}
            </Typography>
          </Grid>
          <Grid container alignItems="center">
            <Typography variant="body3">MaxDownDraw : </Typography>
            <Typography variant="h5" color="error">
              -{strategy.mdd}%
            </Typography>
          </Grid>
        </Grid>

        <Grid container alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h5" sx={{ mt: 2 }}>
              Data In 1 Month
            </Typography>
            <Grid item container direction="row" alignItems="center">
              <Typography variant="body2">Trade Count: </Typography>
              <Typography variant="h5" color="green">
                {strategy.one_month_static?.trade_count || 'N/A'}
              </Typography>
            </Grid>
            <Grid item container direction="row" alignItems="center">
              <Typography variant="body2">PNL Ratio: </Typography>

              <Typography variant="h5" color="green">
                {strategy.one_month_static?.pnl_ratio || 'N/A'}%
              </Typography>
            </Grid>
            <Grid item container direction="row" alignItems="center">
              <Typography variant="body2">Profit Ratio: </Typography>
              <Typography variant="h5" color="green">
                {strategy.one_month_static?.profit_ratio || 'N/A'}%
              </Typography>
            </Grid>
            <Grid item container direction="row" alignItems="center">
              <Typography variant="body2">Win Ratio: </Typography>
              <Typography variant="h5" color="green">
                {strategy.one_month_static?.win_ratio || 'N/A'}%
              </Typography>
            </Grid>
          </Grid>
          <Grid item>
            <Typography variant="h5" sx={{ mt: 2 }}>
              Data In 3 Month
            </Typography>
            <Grid item container direction="row" alignItems="center">
              <Typography variant="body2">Trade Count: </Typography>
              <Typography variant="h5" color="green">
                {strategy.thr_month_static?.trade_count || 'N/A'}
              </Typography>
            </Grid>
            <Grid item container direction="row" alignItems="center">
              <Typography variant="body2">PNL Ratio: </Typography>
              <Typography variant="h5" color="green">
                {strategy.thr_month_static?.pnl_ratio || 'N/A'}%
              </Typography>
            </Grid>
            <Grid item container direction="row" alignItems="center">
              <Typography variant="body2">Profit Ratio: </Typography>
              <Typography variant="h5" color="green">
                {strategy.thr_month_static?.profit_ratio || 'N/A'}%
              </Typography>
            </Grid>
            <Grid item container direction="row" alignItems="center">
              <Typography variant="body2">Win Ratio: </Typography>
              <Typography variant="h5" color="green">
                {strategy.thr_month_static?.win_ratio || 'N/A'}%
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        <Button
          variant="contained"
          sx={{
            mt: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
            // bgcolor: '#4caf50',
            // color: '#fff',
            // '&:hover': { bgcolor: '#388e3c' }
          }}
          onClick={handleButtonClick}
        >
          See Detail
        </Button>
      </CardContent>
    </Card>
  );
};
export default StrategyCard;
