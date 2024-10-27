import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, useMediaQuery } from '@mui/material';
import Drawer from './Drawer';

import { openDrawer } from 'store/reducers/sidebar';

// ==============================|| MAIN LAYOUT ||============================== //

const TokenLayout = () => {
  const dispatch = useDispatch();

  const { drawerOpen } = useSelector((state) => state.sidebar);

  const [open, setOpen] = useState(drawerOpen);
  const handleDrawerToggle = () => {
    console.log('handleDrawerToggle clicked');

    setOpen(!open);
    dispatch(openDrawer({ drawerOpen: !open }));
  };

  useEffect(() => {
    if (open !== drawerOpen) setOpen(drawerOpen);
  }, [drawerOpen]);

  return (
    <Box sx={{ display: 'flex', width: '100%', bgcolor: 'background.deep' }}>
      <Box>
        <Outlet />
      </Box>
      <Box component="nav" sx={{ flexShrink: { md: 0 }, zIndex: 1300, bgcolor: 'background.deep' }} aria-label="mailbox folders">
        <Drawer open={open} handleDrawerToggle={handleDrawerToggle} />
      </Box>
    </Box>
  );
};

export default TokenLayout;
