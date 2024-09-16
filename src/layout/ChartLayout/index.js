import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Toolbar, useMediaQuery } from '@mui/material';

// project import
import Drawer from './Drawer';
import Header from './Header';
import TokenBar from './TokenBar';

import { openDrawer } from 'store/reducers/menu';

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = () => {
  const theme = useTheme();
  const matchDownLG = useMediaQuery(theme.breakpoints.down('lg'));
  const dispatch = useDispatch();

  const { drawerOpen } = useSelector((state) => state.menu);

  // drawer toggler
  const [open, setOpen] = useState(drawerOpen);
  const handleDrawerToggle = () => {
    setOpen(!open);
    dispatch(openDrawer({ drawerOpen: !open }));
  };

  // set media wise responsive drawer
  useEffect(() => {
    setOpen(!matchDownLG);
    dispatch(openDrawer({ drawerOpen: !matchDownLG }));
  }, [matchDownLG]);

  useEffect(() => {
    if (open !== drawerOpen) setOpen(drawerOpen);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drawerOpen]);

  return (
    <Box sx={{ display: 'flex', width: '100%', bgcolor: 'background.deep' }}>
      {/* <Header open={open} handleDrawerToggle={handleDrawerToggle} /> */}
      <Header />
      <TokenBar />
      {/* <Drawer open={open} handleDrawerToggle={handleDrawerToggle} /> */}
      <Drawer open={true} />

      <Box component="main" sx={{ width: '100%', flexGrow: 1, p: { xs: 2, sm: 3 }, bgcolor: 'background.deep' }}>
        <Toolbar />
        {/* <Breadcrumbs navigation={navigation} title /> */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;
