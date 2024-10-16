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
  const location = useLocation();

  const { tokenItem } = useSelector((state) => state.token);
  const { drawerOpen, openItem } = useSelector((state) => state.menu);
  const chartId = openItem ? openItem[0] : null;

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
        <PriceVolumeChart symbol={tokenItem.symbol} path={'pbv'} />
      </div>
    );
  }
  if (location.pathname.includes('/walletPriceByVolume')) {
    return (
      <div>
        <h1>AreaChart</h1>
        <PriceVolumeChart symbol={tokenItem.symbol} path={'walletPbv'} />
      </div>
    );
  }
  if (location.pathname.includes('/USDPnNVolume')) {
    return (
      <div>
        <h1>VolumeChart</h1>
        <VolumeChart symbol={tokenItem.symbol} usd={'Usd'} />
      </div>
    );
  }
  if (location.pathname.includes('/PnNVolume')) {
    return (
      <div>
        <h1>VolumeChart</h1>
        <VolumeChart symbol={tokenItem.symbol} usd={''} />
      </div>
    );
  }

  return (
    <div>
      <h1>AnalyzePage</h1>
      <AraeChart2 symbol={tokenItem.symbol} chart={chartId ? chartId : 'avgCost'} />
    </div>
  );
}
