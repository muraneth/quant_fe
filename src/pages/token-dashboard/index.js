import { Box } from '@mui/system';
import TokenBar from './TokenBar';
import { useEffect, useState } from 'react';
import TokenBaseInfo from './TokenBaseInfo';
import MainChart from './main-chart';
export default function TokenDashboardPage() {
  const [symbol, setSymbol] = useState('NPC');
  const chooseToken = (item) => {
    setSymbol(item.symbol);
  };
  return (
    <Box sx={{ width: '100%', m:2 ,mt:6}}>
      <TokenBar chooseToken={chooseToken} />
      <TokenBaseInfo symbol={symbol} />
      <MainChart symbol={symbol} />
    </Box>
  );
}
