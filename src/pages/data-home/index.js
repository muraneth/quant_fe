import { Box, useMediaQuery, Button } from '@mui/material';
import TokenTable from './TokenTable';
export default function DataHome() {
  return (
    <Box sx={{ width: '100%', ml: { xs: 2, md: 3 }, mt: '60px' }}>
      <div>
        <h1>Data Home</h1>
        <h2>It is all about making right descion</h2>
        <TokenTable />
      </div>
    </Box>
  );
}
