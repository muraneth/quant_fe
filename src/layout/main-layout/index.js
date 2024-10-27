import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Toolbar, useMediaQuery } from '@mui/material';

// project import

import Header from './Header';

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = () => {
  const theme = useTheme();

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.deep' }}>
      <Header />

      {/* <Box sx={{ flexGrow: 1 }}> */}
      {/* Ensures Outlet takes full remaining width */}
      <Outlet />
      {/* </Box> */}
    </Box>
  );
};

export default MainLayout;
