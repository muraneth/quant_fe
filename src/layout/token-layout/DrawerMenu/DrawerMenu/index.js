import { Box, Drawer, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import GradeIcon from '@mui/icons-material/Grade';
const DrawerMenu = ({ handleDrawerToggle }) => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Button onClick={handleDrawerToggle}>
        <MenuIcon />
      </Button>

      <Button>
        <GradeIcon />
      </Button>
    </Box>
  );
};
export default DrawerMenu;
