import { Box } from '@mui/system';
import BarContent from './BarContent';
import { Outlet } from 'react-router-dom';

const SideBar = () => {
  return (
    <Box
      sx={{
        display: 'flex', // Add flex display
        width: '100%' // Take full width of parent
      }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>
      <Box
        sx={{
          width: '10px',
          bgcolor: 'background.deep',
          marginLeft: 'auto' // Push to the right
        }}
      >
        <BarContent />
      </Box>
    </Box>
  );
};

export default SideBar;
