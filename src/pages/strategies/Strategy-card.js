

import { useNavigate } from 'react-router-dom';
import { Box, Card,CardContent,Typography,Button,LinearProgress } from '@mui/material';


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
          <Typography variant="h5" component="div">
            {strategy.name}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            {strategy.description}
          </Typography>
          <RiskBar value={strategy.risk} />
          <Typography variant="body2" sx={{ mt: 2 }}>
            Last month: {strategy.lastMonth || 'N/A'}
          </Typography>
          <Typography variant="body2">Last 6 months: {strategy.lastSixMonths || 'N/A'}</Typography>
          <Typography variant="body2">Min. Investment: {strategy.minInvestment}</Typography>
          <Typography variant="body2">Trade Count: {strategy.tradeCount || 'N/A'}</Typography>
          <Typography variant="body2">Win Ratio: {strategy.winRatio || 'N/A'}</Typography>
          <Typography variant="body2">Coins: {strategy.coins?.join(', ')}</Typography>
          <Button variant="contained" sx={{ mt: 2 }} onClick={handleButtonClick}>
            See Detail
          </Button>
        </CardContent>
      </Card>
    );
  };
  export default StrategyCard;