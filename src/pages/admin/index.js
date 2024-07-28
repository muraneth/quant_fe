import HeaderContent from 'layout/MainLayout/Header/HeaderContent/index';
import PositionTable from './positions';
import SystemOrderTable from './system_order';

import { Box, Button, Grid, Stack, Typography, Divider } from '@mui/material';
import Header from 'layout/MainLayout/Header/index';
import axios from 'axios';

const accounts = ['helen', 'myquant_alpha', 'jizhou', 'mydreamy', 'linda001', 'mudidi'];
const AdminPage = () => {
  return (
    <div>
      <Header />
      <Typography variant="h4" component="div" sx={{ mt: 2, ml: 2, pt: 10 }}>
        Positions
      </Typography>
      {accounts.map((account, key) => (
        <Box key={key} sx={{ pt: 1, m: 5, border: '2px  white' }} component="section">
          <PositionTable accountId={account} />

          <Box sx={{ pt: 3, px: 5, border: '1px  grey' }}>
            <Typography variant="h7" component="div" sx={{ color: 'gray' }}>
              System Orders
            </Typography>
            <SystemOrderTable accountId={account} />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, pt: 1 }}>
            <Divider sx={{ borderColor: 'white', width: '120%' }} />
          </Box>
        </Box>
      ))}
    </div>
  );
};
export default AdminPage;
