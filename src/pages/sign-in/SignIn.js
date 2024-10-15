import * as React from 'react';
import { useEffect } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';

import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

import ForgotPassword from './ForgotPassword';

import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';

import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Logo from 'components/Logo';
import CustomTextField from 'components/overrides/CustomTextField';

import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

function ToggleCustomTheme({ showCustomTheme, toggleCustomTheme }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100dvw',
        position: 'fixed',
        bottom: 24
      }}
    >
      <ToggleButtonGroup
        color="primary"
        exclusive
        value={showCustomTheme}
        onChange={toggleCustomTheme}
        aria-label="Toggle design language"
        sx={{
          backgroundColor: 'background.default',
          '& .Mui-selected': {
            pointerEvents: 'none'
          }
        }}
      >
        <ToggleButton value>
          <AutoAwesomeRoundedIcon sx={{ fontSize: '20px', mr: 1 }} />
          Custom theme
        </ToggleButton>
        <ToggleButton value={false}>Material Design 2</ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}

ToggleCustomTheme.propTypes = {
  showCustomTheme: PropTypes.shape({
    valueOf: PropTypes.func.isRequired
  }).isRequired,
  toggleCustomTheme: PropTypes.func.isRequired
};

export default function SignIn() {
  const [mode] = React.useState('light');

  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [uid, setUid] = React.useState('');

  const navigate = useNavigate();

  const handleGoogleLoginSuccess = (credentialResponse) => {
    const token = credentialResponse.credential;
    console.log('idToken:', token);
    const userObject = jwtDecode(token);
    console.log('userObject:', userObject);
    // userObject.email will contain the user's email address
    // handleLogin(userObject.email, 'google');
    localStorage.setItem('idToken', token);
    navigate('/home');
  };

  const handleGoogleLoginError = () => {
    console.log('Login Failed');
  };

  const handleLogin= async (email, password) =>{
    try {
      const response = await axios.post('https://matrixcipher.com/api/user/login', {
        email,
        password
      });
      const { token, uid, username } = response.data.data;

      console.log(uid);

      localStorage.setItem('token', token);
      localStorage.setItem('uid', uid);
      localStorage.setItem('username', username);
      setUid(uid);
      console.log('Logged in successfully!');
    } catch (error) {
      console.log(error);
      console.log('Invalid username or password');
      setEmailError(true);
      setEmailErrorMessage('Invalid username or password');
      setPasswordError(true);
    }
  }

  
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get('email');
    const password = data.get('password');
    handleLogin(email, password);
   
  };

  

  useEffect(() => {
    if (uid !== '') {
      navigate('/user/dashboard');
    }
  }, [uid]);

  const validateInputs = () => {
    const email = document.getElementById('email');
    const password = document.getElementById('password');

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    if (!password.value || password.value.length < 4) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    return isValid;
  };

  return (
    <>
      {/* <CssBaseline /> */}
      <Stack
        component="main"
        direction="column"
        justifyContent="space-between"
        sx={(theme) => ({
          backgroundRepeat: 'no-repeat',
          // backgroundImage:
          //   theme.palette.mode === 'light'
          //     ? 'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))'
          //     : 'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.3), hsl(220, 30%, 5%))',
          backgroundImage:
            theme.palette.mode === 'light'
              ? 'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 90%), transparent)'
              : 'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 16%), transparent)',
          pb: { xs: 12, sm: 0 }
        })}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{
            position: { xs: 'static', sm: 'fixed' },
            width: '100%',
            p: { xs: 2, sm: 4 }
          }}
        >
          <Logo />
        </Stack>

        <Stack justifyContent="center" sx={{ height: { xs: '100%', sm: '100dvh' }, p: 2 }}>
          <Card
            variant="outlined"
            sx={(theme) => ({
              // backgroundColor: theme.palette.mode === 'light' ? 'background.paper' : 'background.default',

              display: 'flex',
              flexDirection: 'column',
              alignSelf: 'center',
              width: { xs: '100%', sm: '450px' },
              p: { xs: 2, sm: 4 },
              gap: 4,
              boxShadow:
                theme.palette.mode === 'light'
                  ? 'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px, hsla(220, 30%, 5%, 0.05) 0px 0px 0px 1px'
                  : 'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px, hsla(220, 30%, 5%, 0.05) 0px 0px 0px 1px'
            })}
          >
            {/* <Logo /> */}
            <Typography component="h1" variant="h4" sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}>
              Sign in
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                gap: 2
              }}
            >
              <FormControl>
                <FormLabel htmlFor="email">Email</FormLabel>
                <CustomTextField
                  error={emailError}
                  helperText={emailErrorMessage}
                  id="email"
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  autoComplete="email"
                  autoFocus
                  required
                  fullWidth
                  variant="outlined"
                  color={emailError ? 'error' : 'primary'}
                  sx={{ ariaLabel: 'email' }}
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="password">Password</FormLabel>

                <CustomTextField
                  error={passwordError}
                  helperText={passwordErrorMessage}
                  name="password"
                  placeholder="••••••"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  autoFocus
                  required
                  fullWidth
                  variant="outlined"
                  color={passwordError ? 'error' : 'primary'}
                />
              </FormControl>

              {/* <ForgotPassword open={open} handleClose={handleClose} /> */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  bgcolor: 'secondary.main',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'secondary.light'
                  }
                }}
                onClick={validateInputs}
              >
                Sign in
              </Button>
              <Link
                href="/sign-up/"
                variant="body2"
                sx={{
                  alignSelf: 'center',
                  color: 'common.white'
                }}
              >
                Don&apos;t have an account? Sign up
              </Link>
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                mt: 2
              }}
            >
              <GoogleLogin onSuccess={handleGoogleLoginSuccess} onError={handleGoogleLoginError} useOneTap />
            </Box>
          </Card>
        </Stack>
      </Stack>
    </>
  );
}
