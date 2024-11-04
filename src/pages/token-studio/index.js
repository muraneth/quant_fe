import { Box } from '@mui/system';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import MainChart from './main-chart';
import Indicator from './tv';
import Drawer from './Drawer';
export default function TokenStudio() {
  const { symbol } = useParams();
  return (
    <Box sx={{ display: 'flex', width: '100%', bgcolor: 'background.deep' }}>
      <Box
        sx={{
          flexGrow: 1,
          overflow: 'hidden' // Prevent overflow
        }}
      >
        <Indicator />
      </Box>
      <Box
        sx={{
          width: '250px', // Set width based on drawer state
          transition: 'width 0.3s ease', // Smooth transition for width change
          overflow: 'hidden' // Prevent overflow when drawer is closed
        }}
      >
        <Drawer />
      </Box>

      <Box sx={{ height: 100 }}></Box>
    </Box>
  );
}
