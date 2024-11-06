import { Box } from '@mui/system';
import { Button } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import MainChart from './main-chart';
import Indicator from './tv';
import Drawer from './Drawer';
import { use } from 'echarts';
export default function TokenStudio() {
  const { symbol } = useParams();
  const [studioType,setStudioType] = useState('chart');
 const onSwitch = () => {
    setStudioType( studioType === 'chart' ? 'indicator' : 'chart');
  }
  return (
    <Box sx={{ display: 'flex', width: '100%', bgcolor: 'background.deep' }}>
      <Button onClick={() => onSwitch()}>Switch</Button>
      <Box
        sx={{
          flexGrow: 1,
          overflow: 'hidden',
          m: 5
        }}
      >
        {
          studioType === 'chart' ? <MainChart symbol={symbol} /> : <Indicator />
        }
       
      </Box>
      
      <Drawer />
      {/* <Box sx={{ height: 100 }}></Box> */}
    </Box>
  );
}
