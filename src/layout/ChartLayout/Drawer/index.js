import PropTypes from 'prop-types';
import { useMemo } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Drawer, useMediaQuery } from '@mui/material';

// project import
import DrawerHeader from './DrawerHeader';
import DrawerContent from './DrawerContent';
import MiniDrawerStyled from './MiniDrawerStyled';
import { drawerWidth } from 'config';

// ==============================|| MAIN LAYOUT - DRAWER ||============================== //

const MainDrawer = ({ open, handleDrawerToggle, window }) => {
  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down('lg'));

  // header content
  const drawerContent = useMemo(() => <DrawerContent />, []);
  const drawerHeader = useMemo(() => <DrawerHeader open={open} />, [open]);

  return (
    <Box component="nav" sx={{ flexShrink: { md: 0 }, bgcolor: 'background.deep' }} aria-label="mailbox folders">
      <MiniDrawerStyled variant="permanent" open={open} sx={{ bgcolor: 'background.deep', marginTop: '64px' }}>
        {/* {drawerHeader} */}
        {drawerContent}
      </MiniDrawerStyled>
    </Box>
  );
};

MainDrawer.propTypes = {
  open: PropTypes.bool,
  handleDrawerToggle: PropTypes.func,
  window: PropTypes.object
};

export default MainDrawer;
