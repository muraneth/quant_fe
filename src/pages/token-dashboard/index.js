import { Box } from '@mui/system';
import TokenBar from './TokenBar';
import { useEffect, useState } from 'react';
import TokenBaseInfo from './TokenBaseInfo';
import MainChart from './main-chart';
export default function TokenDashboardPage() {
  const [symbol, setSymbol] = useState('ANDY');
  const chooseToken = (item) => {
    setSymbol(item.symbol);
  };
  return (
    <Box sx={{ width: '100%', m: 2, mt: 6, position: 'relative' }}>
      <Box sx={{ position: 'sticky', top: 0, zIndex: 1000 }}>
        <TokenBar chooseToken={chooseToken} />
      </Box>
      <TokenBaseInfo symbol={symbol} />
      <MainChart symbol={symbol} />
      <Box sx={{ height: 100 }}></Box>
    </Box>
  );
}
