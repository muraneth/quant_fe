import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import MainCard from 'components/MainCard';
import MultiChart from './MultiChart';
import SelectToken from './SelectToken';
import SelectChart from './SelectChart';

export default function ComparePage() {
  const [boxes, setBoxes] = useState([{ id: Date.now(), chart: 'TradeVolumeVsPoolSize', symbols: [] }]);

  const addBox = () => {
    setBoxes([...boxes, { id: Date.now(), chart: '', symbols: [] }]);
  };

  const updateSymbols = (newSymbols) => {
    setBoxes(boxes.map((box) => ({ ...box, symbols: newSymbols })));
    console.log('boxes', boxes);
  };

  const updateChart = (id, newChart) => {
    setBoxes(boxes.map((box) => (box.id === id ? { ...box, chart: newChart } : box)));
  };
  return (
    <Box sx={{ width: '100%', ml: { xs: 1, md: 1 }, mt: 10 }}>
      <SelectToken onSelect={updateSymbols} />
      {boxes.map((box) => (
        <MainCard key={box.id} content={false} sx={{ mt: 1.5, bgcolor: 'background.paper' }}>
          <Box sx={{ pt: 1, pr: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, ml: 4 }}>
              MultiChart
            </Typography>

            <SelectChart onSelect={(newChart) => updateChart(box.id, newChart)} />

            <MultiChart chart={box.chart} symbols={box.symbols} />
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
