/* eslint-disable no-unused-vars */

// material-ui
import { Box, useMediaQuery, Button } from '@mui/material';

import Profile from './Profile';
import Logo from 'components/Logo';
import { width } from '../../../../../node_modules/@mui/system/index';

// ==============================|| HEADER - CONTENT ||============================== //

const HeaderContent = () => {
  const matchesXs = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const username = localStorage.getItem('username');

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
          <Button variant="text" color="primary" size="large" href="/home">
            Home
          </Button>

          <Button variant="text" color="primary" size="large" href="/chart/">
            Chart
          </Button>

          <Button variant="text" color="primary" size="large" href="/dashboard/">
            Dashboard
          </Button>
        </Box>
      </Box>

      {!username && (
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

      {username && <Profile />}
    </>
  );
};

export default HeaderContent;
