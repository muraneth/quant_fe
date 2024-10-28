import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, useMediaQuery } from '@mui/material';
import Drawer from './Drawer';

import { openDrawer } from 'store/reducers/sidebar';
import DrawMenu from './DrawerMenu/index';

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
        <Box sx={{ 
        flexGrow: 1,
        width: '100%',
        overflow: 'auto',
        p: 0 
      }}>
        <Outlet />
      </Box>

      <Box  sx={{ flexShrink:0, zIndex: 1300, bgcolor: 'background.deep' }} aria-label="mailbox folders">
        <Drawer open={open} handleDrawerToggle={handleDrawerToggle} />
        <DrawMenu handleDrawerToggle={handleDrawerToggle} />
      </Box>
     
    </Box>
  );
};

export default TokenLayout;
