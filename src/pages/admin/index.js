import HeaderContent from 'layout/MainLayout/Header/HeaderContent/index';
import PositionTable from './positions';
import SystemOrderTable from './system_order';

import { Box, Button, Grid, Stack, Typography, Divider } from '@mui/material';
import Header from 'layout/MainLayout/Header/index';
import axios from 'axios';

const accounts = ['helen', 'mudidi', 'linda001', 'myquant_alpha', 'jizhou', 'mydreamy'];
const AdminPage = () => {
  return (
    <div>
      <Header />
      <Typography variant="h4" component="div" sx={{ mt: 2, ml: 2, pt: 10 }}>
        Positions
      </Typography>
      {accounts.map((account, key) => (
        <Box key={key} sx={{ pt: 1, m: 2, border: '2px dashed white' }} component="section">
          <PositionTable accountId={account} />
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, pt: 1 }}>
            <Divider sx={{ borderColor: 'gray', width: '80%' }} />
          </Box>
          <Box sx={{ pt: 1, px: 5, border: '1px  grey' }}>
            <Typography variant="h7" component="div" sx={{ color: 'gray' }}>
              System Orders
            </Typography>
            <SystemOrderTable accountId={account} />
          </Box>
        </Box>
      ))}

      {/* <PositionTable productSymbol="exp" /> */}
    </div>
  );
};
export default AdminPage;
