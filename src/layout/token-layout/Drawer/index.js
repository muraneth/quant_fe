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
import DrawerMenu from './DrawerMenu/index';

// ==============================|| MAIN LAYOUT - DRAWER ||============================== //

const MainDrawer = ({ open, handleDrawerToggle }) => {
  const theme = useTheme();

  // header content
  const drawerContent = useMemo(() => <DrawerContent />, []);

  return (
    <Box component="nav" sx={{ flexShrink: { md: 0 }, bgcolor: 'background.deep' }} aria-label="mailbox folders">
      {!open && (
        <MiniDrawerStyled variant="permanent" open={false} anchor="right" sx={{ bgcolor: 'background.deep', marginTop: '64px' }}>
          <DrawerMenu handleDrawerToggle={handleDrawerToggle} />
        </MiniDrawerStyled>
      )}

      {open && (
        <MiniDrawerStyled variant="permanent" open={true} anchor="right" sx={{ bgcolor: 'background.deep', marginTop: '64px' }}>
          <DrawerMenu handleDrawerToggle={handleDrawerToggle} />
          {drawerContent}
        </MiniDrawerStyled>
      )}
    </Box>
  );
};

MainDrawer.propTypes = {
  open: PropTypes.bool,
  handleDrawerToggle: PropTypes.func,
  window: PropTypes.object
};

export default MainDrawer;
