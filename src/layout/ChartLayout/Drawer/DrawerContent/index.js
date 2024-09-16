// project import

import NavCard from './NavCard';
import Navigation from './Navigation';
import SimpleBar from 'components/third-party/SimpleBar';

// ==============================|| DRAWER CONTENT ||============================== //

const DrawerContent = () => (
  <SimpleBar
    sx={{
      '& .simplebar-content': {
        display: 'flex',
        flexDirection: 'column'
      },
      bgcolor: 'background.deep',
      height: 'calc(100vh - 58px)'
    }}
  >
    <Navigation />
    <NavCard />
  </SimpleBar>
);

export default DrawerContent;
