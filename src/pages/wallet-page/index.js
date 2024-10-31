import WalletTable from './WalletTable';
import { Box } from '@mui/material';
export default function WalletPage() {
  return (
    <Box sx={{ mt: 10, display: 'flex', justifyContent: 'center' }}>
      <WalletTable />
    </Box>
  );
}
