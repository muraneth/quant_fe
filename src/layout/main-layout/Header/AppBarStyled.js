// material-ui
import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';

// project import
import { drawerWidth } from 'config';
import { margin } from '../../../../node_modules/@mui/system/spacing';

// ==============================|| HEADER - APP BAR STYLED ||============================== //

const AppBarStyled = styled(AppBar, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 2,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  width: '100%'
}));

export default AppBarStyled;
