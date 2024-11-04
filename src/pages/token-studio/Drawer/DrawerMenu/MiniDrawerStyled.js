// material-ui
import { styled } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  overflowX: 'hidden',
  width: 48,
  borderRight: 'none',
  // borderLeft: 'none',
  boxShadow: theme.customShadows.z1,
  marginTop: '0px'
});

// ==============================|| DRAWER - MINI STYLED ||============================== //

const MiniDrawerStyled = styled(Drawer, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer,
  // width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ... {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme)
  }
}));

export default MiniDrawerStyled;
