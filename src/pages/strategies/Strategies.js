/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import axios from 'axios';

// import { RiseOutlined, FallOutlined } from '@ant-design/icons';
import React from 'react';
import { Box, Grid, Card, CardContent, Typography, Button, LinearProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
const strategies = [
  {
    id: 1,
    title: 'Altcoin Explosion 4x',
    description: 'A high-risk, high-reward strategy that focuses on altcoins. Levarage x4',
    risk: 60,
    lastMonth: '+10.9%',
    tradeCount: 120,
    winRatio: '60%',
    minInvestment: '$200',
    coins: ['XRP', 'LTC', 'ADA', 'DOT', 'USDT']
  },
  {
    id: 2,
    title: 'Trending strategies',
    description: 'A mix of trending strategies that have been performing well in the last 6 months',
    risk: 30,
    lastMonth: '+10.9%',
    lastSixMonths: '+8.479%',
    minInvestment: '$200',
    coins: ['BTC', 'ETH', 'PEPE']
  },
  {
    title: 'Altcoin Madness',
    platform: 'Coinbase',
    risk: 55,
    lastMonth: '+10.85%',
    minInvestment: '$100',
    coins: ['ETH', 'BTC', 'USDT']
  },
  {
    title: 'Buy the Dip',
    platform: 'Binance',
    risk: 40,
    lastSixMonths: '+10.33%',
    minInvestment: '$200',
    coins: ['BTC', 'USDT']
  },
  {
    title: 'ChatGPT Coin Conquerors',
    platform: 'Binance US',
    risk: 70,
    lastSixMonths: '+24.6%',
    minInvestment: '$150',
    coins: ['BTC', 'ETH', 'ADA', 'USDT']
  },
  {
    title: 'ChatGPT Coin Trends',
    platform: 'BingX',
    risk: 75,
    lastSixMonths: '+27.8%',
    minInvestment: '$150',
    coins: ['BTC', 'ETH', 'USDT']
  }
];

const Strategies = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const token = localStorage.getItem('token');
    const uid = localStorage.getItem('uid');
    const host = 'http://matrixcipher.com';
    const response = await axios.get(`${host}/api/user/asset/getAllProduct`, {
      headers: {
        Authorization: token,
        Uid: uid
      }
    });
    setProducts(response.data.data);
  };
  const handleButtonClick = async (productId) => {
    // navigate to the product page
    navigate(`/dashboard/strategy/${productId}`);
  };

  const StrategyCard = ({ strategy, onClick }) => {
    const handleButtonClick = () => {
      // Call the onClick handler with the strategy title
      onClick(strategy.id);
    };
    const RiskBar = ({ value }) => (
      <Box sx={{ width: '100%', mt: 1 }}>
        <LinearProgress variant="determinate" value={value} />
      </Box>
    );

    return (
      <Card sx={{ minWidth: 275, bgcolor: '#1e1e2d', color: '#fff', m: 2 }}>
        <CardContent>
          <Typography variant="h5" component="div">
            {strategy.title}
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
          <Typography variant="body2">Coins: {strategy.coins.join(', ')}</Typography>
          <Button variant="contained" sx={{ mt: 2 }} onClick={handleButtonClick}>
            See more
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3, minHeight: '100vh' }}>
      <Grid container spacing={2}>
        {strategies.map((strategy, index) => (
          <Grid item xs={12} md={6} key={index}>
            <StrategyCard strategy={strategy} onClick={handleButtonClick} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Strategies;
