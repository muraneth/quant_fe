/* eslint-disable no-unused-vars */

// material-ui
import { Box, useMediaQuery, Button } from '@mui/material';
// import { GithubOutlined } from '@ant-design/icons';

// project import
import Search from './Search';
import Profile from './Profile';
import Notification from './Notification';
import MobileSection from './MobileSection';
import Deposit from './Deposit-balance';
import Logo from 'components/Logo';

// ==============================|| HEADER - CONTENT ||============================== //

const HeaderContent = () => {
  const matchesXs = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const username = localStorage.getItem('username');

  return (
    <>
      {/* {!matchesXs && <Search />} */}
      <Box sx={{ width: '100%', ml: { xs: 0, md: 1 } }}>
        <Logo />
      </Box>

      {matchesXs && <Box sx={{ width: '100%', ml: 1 }} />}

      {/* <IconButton
        component={Link}
        href="https://github.com/codedthemes/mantis-free-react-admin-template"
        target="_blank"
        disableRipple
        color="secondary"
        title="Download Free Version"
        sx={{ color: 'text.primary', bgcolor: 'grey.100' }}
      >
        <GithubOutlined />
      </IconButton> */}

      {/* <Notification /> */}
      {username && <Deposit />}
      {!username && (
        <Box sx={{ width: '100%', ml: { xs: 0, md: 1 } }}>
          <Button color="primary" variant="outlined" size="small" component="a" href="/sign-in/" target="_blank">
            Sign in
          </Button>
        </Box>
      )}

      {username && <Profile />}
      {matchesXs && <MobileSection />}
    </>
  );
};

export default HeaderContent;
