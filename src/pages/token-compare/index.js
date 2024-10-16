import React, { useState } from 'react';
import { Box, Checkbox, ListItemText, TextField, Typography } from '@mui/material';
import MainCard from 'components/MainCard';
import MultiChart from './MultiChart';
import SelectToken from './SelectToken';
import SelectChart from './SelectChart';
export default function ComparePage() {
  const [chart, setChart] = useState('TradeVolumeVsPoolSize');
  const [symbols, setSymbols] = useState(['NPC']);
  const [tokens, setTokens] = useState(['NPC', 'ANDY', 'JESUS', 'ELON']);

  return (
    <Box sx={{ width: '100%', ml: { xs: 1, md: 1 }, mt: '60px' }}>
      <MainCard key={'id'} content={false} sx={{ mt: 1.5, bgcolor: 'background.paper' }}>
        <Box sx={{ pt: 1, pr: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, ml: 4 }}>
            MultiChart
          </Typography>

          <TextField label="Chart" variant="outlined" value={chart} onChange={(e) => setChart(e.target.value)} fullWidth />
          <SelectChart />
          <SelectToken />
          {tokens.map((symbol, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
              <Checkbox
                checked={symbols.includes(symbol)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSymbols([...symbols, symbol]);
                  } else {
                    setSymbols(symbols.filter((item) => item !== symbol));
                  }
                }}
              />
              <ListItemText primary={symbol} />
            </Box>
          ))}

          <MultiChart chart={chart} symbols={symbols} />
        </Box>
      </MainCard>
    </Box>
  );
}
