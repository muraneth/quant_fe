import { Box } from '@mui/system';
import { useParams } from 'react-router-dom';

import { useEffect, useState } from 'react';

import MainChart from './main-chart';
export default function TokenDashboardPage() {
  const {symbol} = useParams();
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '100vw', // Ensures box doesn't exceed viewport width
        margin: 0, // Remove margin that might cause overflow
        padding: 0, // Use padding instead of margin for spacing
        paddingTop: 0, // Replace mt with paddingTop
        overflowX: 'hidden' // Prevent horizontal scrolling
      }}
    >

      <MainChart symbol={symbol} />
      <Box sx={{ height: 100 }}></Box>
    </Box>
  );
}
