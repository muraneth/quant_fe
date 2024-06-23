/* eslint-disable no-unused-vars */

import { useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, Typography, Button, LinearProgress, Grid, Item, Stack } from '@mui/material';
import PnlRatioChart from './components/Pnl-Ratiao-Chart';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const StrategyCardNew = ({ strategy }) => {
  const navigate = useNavigate();

  const handleButtonClick = async () => {
    // navigate to the product page
    navigate(`/strategies/${strategy.symbol}`);
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
    <Card sx={{ minWidth: '100%', bgcolor: 'background.paper', color: 'primary.main', m: 2 }}>
      <CardContent>
        <Typography variant="h4" component="div">
          {strategy.name}
        </Typography>

        <RiskBar value={strategy.risk} />
        <Stack item direction="row" pt={2}>
          <Grid container alignItems="center">
            <Typography variant="body3">APY : </Typography>
            <Typography variant="h5" color="green.main">
              {strategy.apy}%
            </Typography>
          </Grid>
          <Grid container alignItems="center">
            <Typography variant="body3">SharpeRatio : </Typography>
            <Typography variant="h5" color="green.main">
              {strategy.sharpe_ratio}
            </Typography>
          </Grid>
          <Grid container alignItems="center">
            <Typography variant="body3">MaxDownDraw : </Typography>
            <Typography variant="h5" color="error">
              -{strategy.mdd}%
            </Typography>
          </Grid>
        </Stack>
        <Box height="300px" sx={{ pt: 2 }}>
          <PnlRatioChart slot="all" product={strategy.symbol} showDetail="true" />
        </Box>

        <Stack direction="row-reverse" spacing={2} sx={{ pt: 1 }}>
          <Button
            variant="contained"
            sx={{
              mt: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',

              bgcolor: 'secondary.main',
              color: 'white',
              '&:hover': {
                bgcolor: 'secondary.light'
              }
            }}
            onClick={handleButtonClick}
          >
            Invest
          </Button>
          <Button
            variant="text"
            size="large"
            endIcon={<ChevronRightIcon />}
            sx={{ color: 'secondary.main' }}
            href={`/strategies/${strategy.symbol}`}
          >
            Info
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};
export default StrategyCardNew;
