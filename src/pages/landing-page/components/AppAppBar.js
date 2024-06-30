import * as React from 'react';
import PropTypes from 'prop-types';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ToggleColorMode from './ToggleColorMode';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import ListItemIcon from '@mui/material/ListItemIcon';

import MenuList from '@mui/material/MenuList';

import { Avatar, Box, ButtonBase, IconButton, Stack, Typography } from '@mui/material';
import avatar1 from 'assets/images/users/avatar-3.png';

import Logo from 'components/Logo';
import Profile from 'layout/MainLayout/Header/HeaderContent/Profile/index';
import TelegramIcon from '@mui/icons-material/Telegram';
import { bgcolor } from '../../../../node_modules/@mui/system/index';

function AppAppBar({ mode, toggleColorMode }) {
  const [open, setOpen] = React.useState(false);
  const [uid, setUid] = React.useState();
  const [username, setUsername] = React.useState('');

  const anchorRef = React.useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  React.useEffect(() => {
    const uid = localStorage.getItem('uid');

    const username = localStorage.getItem('username');
    setUsername(username);
    setUid(uid);
  }, []);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const scrollToSection = (sectionId) => {
    const sectionElement = document.getElementById(sectionId);
    const offset = 128;
    if (sectionElement) {
      const targetScroll = sectionElement.offsetTop - offset;
      sectionElement.scrollIntoView({ behavior: 'smooth' });
      window.scrollTo({
        top: targetScroll,
        behavior: 'smooth'
      });
      setOpen(false);
    }
  };

  return (
    <AppBar
      // position="fixed"
      sx={{
        boxShadow: 0,
        bgcolor: 'transparent',
        backgroundImage: 'none',
        mt: 2
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          variant="regular"
          sx={(theme) => ({
            // display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
            // borderRadius: '999px',
            // bgcolor: theme.palette.mode === 'light' ? 'hsla(220, 60%, 99%, 0.6)' : 'hsla(220, 0%, 0%, 0.7)',
            // backdropFilter: 'blur(24px)',
            maxHeight: 40
            // border: '1px solid',
            // borderColor: 'divider',
            // boxShadow:
            //   theme.palette.mode === 'light'
            //     ? '0 1px 2px hsla(210, 0%, 0%, 0.05), 0 2px 12px hsla(210, 100%, 80%, 0.5)'
            //     : '0 1px 2px hsla(210, 0%, 0%, 0.5), 0 2px 12px hsla(210, 100%, 25%, 0.3)'
          })}
        >
          <Box sx={{ width: '150px' }}>
            <Logo />
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              alignItems: 'center',
              px: 0
            }}
          >
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Button variant="text" color="primary" size="large" href="/strategies/">
                Strategies
              </Button>
              {/* <Button variant="text" color="primary" size="large">
                Community
              </Button> */}
              <div>
                <Button
                  variant="text"
                  color="primary"
                  size="large"
                  ref={anchorRef}
                  id="composition-button"
                  aria-controls={open ? 'composition-menu' : undefined}
                  aria-expanded={open ? 'true' : undefined}
                  aria-haspopup="true"
                  onClick={handleToggle}
                >
                  Community
                </Button>
                <Popper open={open} anchorEl={anchorRef.current} role={undefined} placement="bottom-start" transition disablePortal>
                  {({ TransitionProps, placement }) => (
                    <Grow
                      {...TransitionProps}
                      style={{
                        transformOrigin: placement === 'bottom-start' ? 'left top' : 'left bottom'
                      }}
                    >
                      <Paper>
                        <ClickAwayListener onClickAway={handleClose}>
                          <MenuList
                            autoFocusItem={open}
                            id="composition-menu"
                            aria-labelledby="composition-button"
                            onKeyDown={handleListKeyDown}
                            sx={{ bgcolor: 'transparent' }}
                          >
                            {/* <ListItemIcon> */}
                            <IconButton
                              color="inherit"
                              href="https://t.me/+zyabuhvPEtM0ZGU9"
                              aria-label="Telegram"
                              sx={{ alignSelf: 'center', bgcolor: 'transparent' }}
                              size="small"
                            >
                              <TelegramIcon sx={{ px: 0.5 }} /> Telegram
                            </IconButton>
                            {/* </ListItemIcon> */}
                            {/* <MenuItem onClick={handleClose}>Telegram</MenuItem> */}
                            {/* <MenuItem onClick={handleClose}>My account</MenuItem> */}
                            {/* <MenuItem onClick={handleClose}>Logout</MenuItem> */}
                          </MenuList>
                        </ClickAwayListener>
                      </Paper>
                    </Grow>
                  )}
                </Popper>
              </div>

              {/* <Button variant="text" color="primary" size="large" onClick={() => scrollToSection('faq')} sx={{ minWidth: 0 }}>
                FAQ
              </Button> */}
            </Box>
          </Box>
          {uid && uid.length > 0 ? (
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                gap: 0.5,
                alignItems: 'center'
              }}
            >
              {/* <Button color="primary" variant="outlined" size="midium" component="a" href="/user/dashboard">
                Dashboard
              </Button> */}
              <ButtonBase
                sx={{
                  p: 0.25,
                  bgcolor: 'transparent',
                  borderRadius: 1,
                  '&:hover': { bgcolor: 'gray' }
                }}
                aria-label="open profile"
                // ref={anchorRef}
                aria-controls={open ? 'profile-grow' : undefined}
                aria-haspopup="true"
                // onClick={handleToggle}
                href="/user/dashboard"
              >
                <Stack direction="row" spacing={2} alignItems="center" sx={{ p: 0.5 }}>
                  <Avatar alt="profile user" src={avatar1} sx={{ width: 32, height: 32 }} />
                  <Typography variant="subtitle1">{username}</Typography>
                </Stack>
              </ButtonBase>
              {/* <Profile /> */}
            </Box>
          ) : (
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                gap: 0.5,
                alignItems: 'center'
              }}
            >
              {/* <ToggleColorMode mode={mode} toggleColorMode={toggleColorMode} /> */}
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
          {/* <Box sx={{ display: { sm: 'flex', md: 'none' } }}>
            <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer anchor="top" open={open} onClose={toggleDrawer(false)}>
              <Box
                sx={{
                  p: 2,
                  backgroundColor: 'background.default'
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <ToggleColorMode mode={mode} toggleColorMode={toggleColorMode} />
                  <IconButton onClick={toggleDrawer(false)}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>
                <Divider sx={{ my: 3 }} />
                <MenuItem onClick={() => scrollToSection('features')}>Features</MenuItem>
                <MenuItem onClick={() => scrollToSection('testimonials')}>Testimonials</MenuItem>
                <MenuItem onClick={() => scrollToSection('highlights')}>Highlights</MenuItem>
                <MenuItem onClick={() => scrollToSection('pricing')}>Pricing</MenuItem>
                <MenuItem onClick={() => scrollToSection('faq')}>FAQ</MenuItem>
                <MenuItem>
                  <Button
                    // color="primary"
                    variant="contained"
                    component="a"
                    href="/sign-up/"
                    target="_blank"
                    fullWidth
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
                </MenuItem>
                <MenuItem>
                  <Button
                    // color="primary"
                    variant="outlined"
                    component="a"
                    href="/sign-in/"
                    target="_blank"
                    fullWidth

                  >
                    Sign in
                  </Button>
                </MenuItem>
              </Box>
            </Drawer>
          </Box> */}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

AppAppBar.propTypes = {
  mode: PropTypes.oneOf(['dark', 'light']).isRequired,
  toggleColorMode: PropTypes.func.isRequired
};

export default AppAppBar;
