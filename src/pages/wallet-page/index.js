import WalletTable from './WalletTable';
import { Box } from '@mui/material';
export default function WalletPage() {
  return (
    <Box sx={{ m: 10, display: 'flex', justifyContent: 'center' }}>
      <WalletTable />
    </Box>
  );
}
