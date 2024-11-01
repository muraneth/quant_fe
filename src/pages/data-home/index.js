import { Box, useMediaQuery, Button } from '@mui/material';
import TokenTable from './TokenTable';
export default function DataHome() {
  return (
    <Box sx={{ width: '100%', mt: '60px' }}>
      <div>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
          <h1>It is all about making right descion</h1>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mt: 2,
            overflowX: 'auto' // Enables horizontal scroll if content overflows
          }}
        >
          <TokenTable />
        </Box>
      </div>
    </Box>
  );
}
