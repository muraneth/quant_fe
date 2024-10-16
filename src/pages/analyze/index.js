/* eslint-disable no-unused-vars */

import AraeChart from './AreaChart';
import WalletTable from './WalletTable';
import AraeChart2 from './AreaChart2';
import PriceVolumeChart from './PriceVolumeChart';
import VolumeChart from './VolumeChart';
import MultiChart from './MultiChart';
import MainCard from 'components/MainCard';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Typography, ListItemText } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

export default function AnalyzePage() {
  const [tokens, setTokens] = useState(['NPC', 'ANDY', 'JESUS', 'ELON']);
  const [chart, setChart] = useState('TradeVolumeVsPoolSize');
  const [symbols, setSymbols] = useState(['NPC']);
  const location = useLocation();

  // const { symbol, chartId } = useParams();
  const dispatch = useDispatch();
  const { tokenItem } = useSelector((state) => state.token);
  const { drawerOpen, openItem } = useSelector((state) => state.menu);
  const chartId = openItem ? openItem[0] : null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5005/api/token/tokens');
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
        <PriceVolumeChart symbol={tokenItem} path={'pbv'} />
      </div>
    );
  }
  if (location.pathname.includes('/walletPriceByVolume')) {
    return (
      <div>
        <h1>AreaChart</h1>
        <PriceVolumeChart symbol={tokenItem} path={'walletPbv'} />
      </div>
    );
  }
  if (location.pathname.includes('/USDPnNVolume')) {
    return (
      <div>
        <h1>VolumeChart</h1>
        <VolumeChart symbol={tokenItem} usd={'Usd'} />
      </div>
    );
  }
  if (location.pathname.includes('/PnNVolume')) {
    return (
      <div>
        <h1>VolumeChart</h1>
        <VolumeChart symbol={tokenItem} usd={''} />
      </div>
    );
  }

  return (
    <div>
      <h1>AnalyzePage</h1>
      <AraeChart2 symbol={tokenItem} chart={chartId ? chartId : 'avgCost'} />
    </div>
  );
}
