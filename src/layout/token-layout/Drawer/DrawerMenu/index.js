import { Box, Drawer, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const DrawerMenu = ({ handleDrawerToggle }) => {
  return (
    <Box>
      <Button onClick={handleDrawerToggle}>
        <MenuIcon />
      </Button>
    </Box>
  );
};
export default DrawerMenu;
