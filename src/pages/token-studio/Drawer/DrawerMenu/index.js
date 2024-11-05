import PropTypes from 'prop-types';
import { useMemo } from 'react';

// material-ui
import { Box, Drawer } from '@mui/material';
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
import GradeIcon from '@mui/icons-material/Grade';
// project import

import MiniDrawerStyled from './MiniDrawerStyled';

// ==============================|| MAIN LAYOUT - DRAWER ||============================== //

const DrawMenu = ({ handleDrawerToggle }) => {
  return (
    // <Box component="nav" sx={{ flexShrink: { md: 0 }, bgcolor: 'background.deep' }} aria-label="mailbox folders">
    <MiniDrawerStyled variant="permanent" open={false} anchor="right" sx={{ bgcolor: 'background.deep', marginTop: '0px' }}>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Button onClick={handleDrawerToggle}>
          <MenuIcon />
        </Button>
        <Button>
          <GradeIcon />
        </Button>
      </Box>
    </MiniDrawerStyled>
    // </Box>
  );
};

DrawMenu.propTypes = {
  open: PropTypes.bool,
  handleDrawerToggle: PropTypes.func,
  window: PropTypes.object
};

export default DrawMenu;
