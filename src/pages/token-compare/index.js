import React, { useState } from 'react';
import { Box, Typography, Button,IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import MainCard from 'components/MainCard';
import MultiChart from './MultiChart';
import SelectToken from './SelectToken';
import SelectChart from './SelectChart';

export default function ComparePage() {
  const [sharedZoom, setSharedZoom] = useState({ min: 20, max: 100 }); // Adjust the initial values as needed

  const [boxes, setBoxes] = useState([{ id: Date.now(), chart: 'TradeVolumeVsPoolSize', symbols: [] }]);

  const addBox = () => {
    setBoxes([...boxes, { id: Date.now(), chart: '', symbols: boxes[0].symbols}])
  };
  const deleteBox = (id) => {
    setBoxes(boxes.filter(box => box.id !== id));
  };

  const updateSymbols = (newSymbols) => {
    setBoxes(boxes.map((box) => ({ ...box, symbols: newSymbols })));
    console.log('boxes', boxes);
  };

  const updateChart = (id, newChart) => {
    const newBoxes = boxes.map((box) => (box.id === id ? { ...box, chart: newChart } : box));
    console.log('boxes on updatechart after', newBoxes);
    setBoxes(newBoxes);
  
    
  };
  const handleZoomChange = (newZoom) => {
    console.log('newZoom index', newZoom);

    setSharedZoom(newZoom);
  };
  return (
    <Box sx={{ width: '100%', ml: { xs: 1, md: 1 }, mt: 10 }}>
      <SelectToken onSelect={updateSymbols} />
      {boxes.map((box) => (
        <MainCard key={box.id} content={false} sx={{ mt: 1.5, bgcolor: 'background.paper' }}>
          <Box sx={{ pt: 1, pr: 2, position: 'relative' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, mr: 2 }}>
              <Typography variant="h6" sx={{ ml: 4 }}>
                {box.chart}
              </Typography>
              <IconButton 
                onClick={() => deleteBox(box.id)} 
                disabled={boxes.length === 1}
                sx={{ color: 'error.main' }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>

            <SelectChart onSelect={(newChart) => updateChart(box.id, newChart)} />

            <MultiChart
              chart={box.chart}
              symbols={box.symbols}
              zoom={sharedZoom}
              onZoomChange={handleZoomChange}
            />
          </Box>
        </MainCard>
      ))}
      <Box sx={{ width: '100%', ml: { xs: 1, md: 1 }, mt: '60px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Button variant="contained" onClick={addBox} sx={{ mt: 2 }}>
          Add Box
        </Button>
      </Box>
    </Box>
  );
}
