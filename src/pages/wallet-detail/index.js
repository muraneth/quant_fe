import { useParams } from 'react-router-dom';
import BaseChart from './BaseChart';
import BaseChart2 from './BaseChar2';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MainCard from 'components/MainCard';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

export default function WalletDetail() {
  const { symbol, wallet } = useParams();
  const [walletInfo, setWalletInfo] = useState([]); // Correct useState initialization
  const [inputWallet, setInputWallet] = useState(); // State for wallet address input
  const [inputSymbol, setInputSymbol] = useState();

  const fetchWalletInfo = async (symbol, wallet) => {
    const token = localStorage.getItem('token');
    const uid = localStorage.getItem('uid');
    const postData = {
      token_symbol: symbol,
      wallet_address: wallet
    };

    try {
      const response = await axios.post('http://127.0.0.1:5005/api/data/walletInfo', postData, {
        headers: {
          Authorization: `${token}`,
          Uid: `${uid}`
        }
      });
      setWalletInfo(response.data.data ? response.data.data : []);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (!inputWallet) {
      setInputWallet(wallet);
    }
    if (!inputSymbol) {
      setInputSymbol(symbol);
    }

    fetchWalletInfo(inputSymbol, inputWallet);
  }, [inputWallet, inputSymbol, symbol, wallet]); // Runs when symbol or wallet changes

  const chartKeys = [
    'balance',
    'balance_chg',
    // 'balance_usd',
    'avg_cost',
    'total_cost',
    'realized_pnl',
    'total_pnl',
    'unrealized_pnl',

    'total_cost',
    'total_token_day',
    'avg_token_day',
    'token_day_destory'
  ];
  const [visibleKeys, setVisibleKeys] = useState([]);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setVisibleKeys(chartKeys);
    }, 300);

    return () => clearTimeout(timeout);
  }, [chartKeys]);

  return (
    <div>
      <h1>WalletDetail</h1>
      <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
        <TextField label="Token Symbol" variant="outlined" value={symbol} onChange={(e) => setInputSymbol(e.target.value)} fullWidth />

        <TextField label="Wallet Address" variant="outlined" value={wallet} onChange={(e) => setInputWallet(e.target.value)} fullWidth />
        <Button variant="contained" onClick={fetchWalletInfo} color="primary">
          FetchData
        </Button>
      </Box>
      {visibleKeys.map((key) => (
        <MainCard key={key} content={false} sx={{ mt: 1.5, bgcolor: 'background.paper' }}>
          <Box sx={{ pt: 1, pr: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, ml: 4 }}>
              {key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' ')} Chart
            </Typography>
            <BaseChart2 chartData={walletInfo} dataKey={key} />
          </Box>
        </MainCard>
      ))}
    </div>
  );
}
