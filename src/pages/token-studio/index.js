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
          overflow: 'hidden',
          m: 5
        }}
      >
        <Indicator />
      </Box>

      <Drawer />
      {/* <Box sx={{ height: 100 }}></Box> */}
    </Box>
  );
}
