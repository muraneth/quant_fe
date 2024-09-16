import { useParams } from 'react-router-dom';
import BaseChart from './BaseChart';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MainCard from 'components/MainCard';

export default function WalletDetail() {
  const { symbol, wallet } = useParams();
  const [walletInfo, setWalletInfo] = useState([]); // Correct useState initialization

  useEffect(() => {
    const token = localStorage.getItem('token');
    const uid = localStorage.getItem('uid');
    const postData = {
      token_symbol: symbol,
      wallet_address: wallet
    };

    const fetchWalletInfo = async () => {
      try {
        const response = await axios.post('http://127.0.0.1:5005/api/data/walletInfo', postData, {
          headers: {
            Authorization: `${token}`,
            Uid: `${uid}`
          }
        });
        setWalletInfo(response.data.data ? response.data.data : []); // Correct use of setWalletInfo
      } catch (error) {
        console.error(error);
      }
    };

    fetchWalletInfo();
  }, [symbol, wallet]); // Runs when symbol or wallet changes

  const chartKeys = [
    'balance',
    'balance_usd',
    'avg_cost',
    'total_cost',
    'realized_pnl',
    'total_pnl',
    'unrealized_pnl',

    'balance_chg',
    'total_cost',
    'total_token_day',
    'avg_token_day',
    'token_day_destory'
  ];
  const [visibleKeys, setVisibleKeys] = useState([]);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setVisibleKeys(chartKeys);
    }, 300); // Delaying chart rendering by 300ms

    return () => clearTimeout(timeout);
  }, [chartKeys]);

  return (
    <div>
      <h1>WalletDetail</h1>
      {visibleKeys.map((key) => (
        <MainCard key={key} content={false} sx={{ mt: 1.5, bgcolor: 'background.paper' }}>
          <Box sx={{ pt: 1, pr: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, ml: 4 }}>
              {key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' ')} Chart
            </Typography>
            <BaseChart chartData={walletInfo} dataKey={key} />
          </Box>
        </MainCard>
      ))}
    </div>
  );
}
