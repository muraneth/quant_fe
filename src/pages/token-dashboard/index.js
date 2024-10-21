import { Box } from '@mui/system';
import TokenBar from './TokenBar';
import { useEffect, useState } from 'react';
import TokenBaseInfo from './TokenBaseInfo';
export default function TokenDashboardPage() {
  const [symbol, setSymbol] = useState('NPC');
  const chooseToken = (item) => {
    setSymbol(item.symbol);
  };
  return (
    <Box sx={{ width: '100%', ml: { xs: 1, md: 1 }, mt: 12 }}>
      <TokenBar chooseToken={chooseToken} />

      <TokenBaseInfo symbol={symbol} />
    </Box>
  );
}
