import PropTypes from 'prop-types';
import { useMemo } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Drawer, useMediaQuery } from '@mui/material';

// project import

import MiniDrawerStyled from './MiniDrawerStyled';

import DrawerMenu from './DrawerMenu/index';

// ==============================|| MAIN LAYOUT - DRAWER ||============================== //

const DrawMenu = ({ open, handleDrawerToggle }) => {
  return (
    <Box component="nav" sx={{ flexShrink: { md: 0 }, bgcolor: 'background.deep' }} aria-label="mailbox folders">
      <MiniDrawerStyled variant="permanent" open={false} anchor="right" sx={{ bgcolor: 'background.deep', marginTop: '64px' }}>
        <DrawerMenu handleDrawerToggle={handleDrawerToggle} />
      </MiniDrawerStyled>
    </Box>
  );
};

DrawMenu.propTypes = {
  open: PropTypes.bool,
  handleDrawerToggle: PropTypes.func,
  window: PropTypes.object
};

export default DrawMenu;
