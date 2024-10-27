// eslint-disable no-unused-vars
import { Box, useMediaQuery, Button } from '@mui/material';
import { useLocation } from 'react-router-dom'; // Import useLocation
import Profile from './Profile';
import Logo from 'components/Logo';

// ==============================|| HEADER - CONTENT ||============================== //

const HeaderContent = () => {
  const matchesXs = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const userInfoStr = localStorage.getItem('userInfo');
  const userInfo = userInfoStr ? JSON.parse(userInfoStr) : null;

  const location = useLocation(); // Get current URL path

  const isSelected = (path) => location.pathname.includes(path);

  return (
    <>
      <Box sx={{ width: 'auto', ml: { xs: 2, md: 3 } }}>
        <Logo />
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 0,
          width: 'auto'
        }}
      >
        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
          <Button
            variant={isSelected('/home') ? 'contained' : 'text'} // Highlight if selected
            color={isSelected('/home') ? 'secondary' : 'primary'}
            size="midium"
            href="/home"
          >
            Home
          </Button>

          <Button
            variant={isSelected('/chart/') ? 'contained' : 'text'}
            color={isSelected('/chart/') ? 'secondary' : 'primary'}
            size="midium"
            href="/chart/"
          >
            Chart
          </Button>

          <Button
            variant={isSelected('/dashboard/') ? 'contained' : 'text'}
            color={isSelected('/dashboard/') ? 'secondary' : 'primary'}
            size="midium"
            href="/dashboard/"
          >
            Dashboard
          </Button>

          <Button
            variant={isSelected('/compare/') ? 'contained' : 'text'}
            color={isSelected('/compare/') ? 'secondary' : 'primary'}
            size="midium"
            href="/compare/"
          >
            Compare
          </Button>
          {/* 考虑是否要钱包详细 */}
          <Button
            variant={isSelected('/wallet/') ? 'contained' : 'text'}
            color={isSelected('/wallet/') ? 'secondary' : 'primary'}
            size="midium"
            href="/wallet/"
          >
            Wallet
          </Button>
        </Box>
      </Box>

      {!userInfo && (
        <Box sx={{ flexShrink: 0, ml: 0.75, gap: 0.5, alignItems: 'center' }}>
          <Button color="primary" variant="outlined" size="midium" component="a" href="/sign-in/">
            Sign in
          </Button>
          <Button
            color="primary"
            variant="contained"
            size="midium"
            component="a"
            href="/sign-up/"
            target="_blank"
            sx={{
              bgcolor: 'secondary.main',
              color: 'white',
              '&:hover': {
                bgcolor: 'secondary.light'
              }
            }}
          >
            Sign up
          </Button>
        </Box>
      )}

      {userInfo && <Profile />}
    </>
  );
};

export default HeaderContent;
