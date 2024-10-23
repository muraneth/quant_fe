import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import { AppBar, IconButton, Toolbar, useMediaQuery } from '@mui/material';

// project import
import AppBarStyled from './AppBarStyled';
import BarContent from './BarContent';

// assets
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';

// ==============================|| MAIN LAYOUT - HEADER ||============================== //

const TokenBar = ({ open, handleDrawerToggle }) => {
  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down('lg'));

  const iconBackColor = 'grey.100';
  const iconBackColorOpen = 'grey.200';

  // common header
  const mainHeader = (
    <Toolbar sx={{ bgcolor: 'background.deep', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)' }}>
      <BarContent />
    </Toolbar>
  );

  // app-bar params
  const appBar = {
    position: 'fixed',
    color: 'inherit',
    elevation: 0,
    sx: {
      borderBottom: `1px solid ${theme.palette.divider}`,
      boxShadow: theme.customShadows.z1,
      '& .MuiToolbar-root': {
        minHeight: '48px',
        padding: '0 16px'
      }
    }
  };

  return (
    
        <AppBarStyled open={open} {...appBar}>
          {mainHeader}
        </AppBarStyled>
  );
};

TokenBar.propTypes = {
  open: PropTypes.bool,
  handleDrawerToggle: PropTypes.func
};

export default TokenBar;
