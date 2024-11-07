import { Box } from '@mui/system';
import { Button } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import MainChart from './main-chart';
import Indicator from './tv';
import Drawer from './Drawer';

export default function TokenStudio() {
  const [searchParams] = useSearchParams();
  const symbol = searchParams.get('symbol');

  const [studioType, setStudioType] = useState('chart');
  const onSwitch = () => {
    setStudioType(studioType === 'chart' ? 'indicator' : 'chart');
  };
  return (
    <Box sx={{ display: 'flex', width: '100%', bgcolor: 'background.deep', height: '100vh', m:0 , pl: 1 }}>
      {/* <Button onClick={() => onSwitch()}>Switch</Button> */}
      <Box
        sx={{
          flexGrow: 1,
          overflow: 'hidden'
        }}
      >
        {studioType === 'chart' ? <MainChart symbol={symbol} /> : <Indicator />}
      </Box>

      <Drawer />
    </Box>
  );
}
