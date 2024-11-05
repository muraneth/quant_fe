import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, useMediaQuery } from '@mui/material';
import DrawerContent from './DrawerContent';

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
    <Box
      sx={{
        width: '200px', // Set width based on drawer state
        transition: 'width 0.5s ease', // Smooth transition for width change
        overflow: 'hidden' // Prevent overflow when drawer is closed
      }}
    >
      <DrawerContent open={open} handleDrawerToggle={handleDrawerToggle} />
      <DrawMenu handleDrawerToggle={handleDrawerToggle} />
    </Box>
  );
};

export default TokenLayout;
