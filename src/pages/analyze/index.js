/* eslint-disable no-unused-vars */

import AraeChart from './AreaChart';
import WalletTable from './WalletTable';
import AraeChart2 from './AreaChart2';
import PriceVolumeChart from './PriceVolumeChart';
import VolumeChart from './VolumeChart';
import MultiChart from './MultiChart';
import MainCard from 'components/MainCard';
import { useState, useEffect } from 'react';

import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Typography, ListItemText } from '@mui/material';

export default function AnalyzePage() {
  const [tokens, setTokens] = useState(['NPC', 'ANDY', 'JESUS', 'ELON']);
  const [chart, setChart] = useState('TradeVolumeVsPoolSize');
  const [symbols, setSymbols] = useState(['NPC']);
  const location = useLocation();

  const { symbol, chartId } = useParams();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5005/api/data/tokens');
        setTokens(response.data.data ? response.data.data : ['NPC']);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  if (location.pathname.includes('/topwallet')) {
    return (
      <div>
        <h1>WalletTable</h1>
        <WalletTable />
      </div>
    );
  }
  if (location.pathname.includes('/PriceByVolume')) {
    return (
      <div>
        <h1>AreaChart</h1>
        <PriceVolumeChart symbol={symbol} path={'pbv'} />
      </div>
    );
  }
  if (location.pathname.includes('/walletPriceByVolume')) {
    return (
      <div>
        <h1>AreaChart</h1>
        <PriceVolumeChart symbol={symbol} path={'walletPbv'} />
      </div>
    );
  }
  if (location.pathname.includes('/USDPnNVolume')) {
    return (
      <div>
        <h1>VolumeChart</h1>
        <VolumeChart symbol={symbol} usd={'Usd'} />
      </div>
    );
  }
  if (location.pathname.includes('/PnNVolume')) {
    return (
      <div>
        <h1>VolumeChart</h1>
        <VolumeChart symbol={symbol} usd={''} />
      </div>
    );
  }

  if (location.pathname.includes('/MultiChart')) {
    return (
      <MainCard key={'id'} content={false} sx={{ mt: 1.5, bgcolor: 'background.paper' }}>
        <Box sx={{ pt: 1, pr: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, ml: 4 }}>
            MultiChart
          </Typography>
          <TextField label="Chart" variant="outlined" value={chart} onChange={(e) => setChart(e.target.value)} fullWidth />
          <Typography>tokens: {tokens}</Typography>

          {tokens.map((symbol, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
              <Checkbox
                checked={symbols.includes(symbol)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSymbols([...symbols, symbol]);
                  } else {
                    setSymbols(symbols.filter((item) => item !== symbol));
                  }
                }}
              />
              <ListItemText primary={symbol} />
            </Box>
          ))}

          <MultiChart chart={chart} symbols={symbols} />
        </Box>
      </MainCard>
    );
  }

  return (
    <div>
      <h1>AnalyzePage</h1>
      <AraeChart2 symbol={symbol} chart={chartId ? chartId : 'avgCost'} />
    </div>
  );
}
