/* eslint-disable no-unused-vars */

import { useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, Typography, Button, LinearProgress, Grid, Item } from '@mui/material';

const StrategyCard = ({ strategy }) => {
  const navigate = useNavigate();

  const handleButtonClick = async () => {
    // navigate to the product page
    navigate(`/dashboard/strategy/${strategy.id}`);
  };
  // const handleButtonClick = () => {
  //   // Call the onClick handler with the strategy title
  //   onClick(strategy.id);
  // };
  const RiskBar = ({ value }) => (
    <Box sx={{ width: '100%', mt: 1 }}>
      <LinearProgress variant="determinate" value={value} />
    </Box>
  );

  return (
    <Card sx={{ minWidth: 275, bgcolor: '#1e1e2d', color: '#fff', m: 2 }}>
      <CardContent>
        <Typography variant="h3" component="div">
          {strategy.name}
        </Typography>

        <RiskBar value={strategy.risk} />
        <Typography variant="body3">Trading Coins: {strategy.coin_pairs?.join(', ')}</Typography>

        <Grid container alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h5" sx={{ mt: 2 }}>
              Data In 1 Month
            </Typography>
            <Typography variant="body2">Trade Count: {strategy.one_month_static?.trade_count || 'N/A'}</Typography>
            <Typography variant="body2">PNL Ratio: {strategy.one_month_static?.pnl_ratio || 'N/A'}</Typography>

            <Typography variant="body2">Profit Ratio: {strategy.one_month_static?.profit_ratio || 'N/A'}</Typography>
            <Typography variant="body2">Win Ratio: {strategy.one_month_static?.win_ratio || 'N/A'}</Typography>
          </Grid>
          <Grid item>
            <Typography variant="h5" sx={{ mt: 2 }}>
              Data In 6 Month
            </Typography>
            <Typography variant="body2">Trade Count: {strategy.six_month_static?.trade_count || 'N/A'}</Typography>
            <Typography variant="body2">PNL Ratio: {strategy.six_month_static?.pnl_ratio || 'N/A'}</Typography>
            <Typography variant="body2">Profit Ratio: {strategy.six_month_static?.profit_ratio || 'N/A'}</Typography>
            <Typography variant="body2">Win Ratio: {strategy.six_month_static?.win_ratio || 'N/A'}</Typography>
          </Grid>
        </Grid>

        <Button
          variant="contained"
          sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={handleButtonClick}
        >
          See Detail
        </Button>
      </CardContent>
    </Card>
  );
};
export default StrategyCard;
