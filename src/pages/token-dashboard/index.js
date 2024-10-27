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
    <Box
      sx={{
        width: '100%',
        maxWidth: '100vw', // Ensures box doesn't exceed viewport width
        margin: 0, // Remove margin that might cause overflow
        padding: 2, // Use padding instead of margin for spacing
        paddingTop: 6, // Replace mt with paddingTop
        overflowX: 'hidden' // Prevent horizontal scrolling
      }}
    >
      <TokenBar chooseToken={chooseToken} />

      <TokenBaseInfo symbol={symbol} />
      <MainChart symbol={symbol} />
      <Box sx={{ height: 100 }}></Box>
    </Box>
  );
}
