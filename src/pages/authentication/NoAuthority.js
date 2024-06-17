import React from 'react';
import { Container, Box, Typography, Button, Grid } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';

const NoAuthorityPage = () => {
  const navigate = useNavigate();
  const handleSignIn = () => {
    navigate('/sign-in', { replace: true });
  };

  const handleSignUp = () => {
    navigate('/sign-up', { replace: true });
  };
  return (
    <Container
      maxWidth="sm"
      style={{
        backgroundColor: '#1A1A40',

        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#FFFFFF',
        textAlign: 'center'
      }}
    >
      <Box
        style={{
          backgroundColor: '#2A2A5A',
          padding: '30px',
          borderRadius: '10px',
          boxShadow: '0px 0px 20px 0px rgba(0,0,0,0.75)'
        }}
      >
        <Box display="flex" justifyContent="center" mb={2}>
          <WarningIcon style={{ color: 'gold', fontSize: '40px', marginRight: '10px' }} />
          <LockIcon style={{ color: 'blue', fontSize: '40px' }} />
          <CheckCircleIcon style={{ color: 'skyblue', fontSize: '40px', marginLeft: '10px' }} />
        </Box>
        <Typography variant="h6" gutterBottom>
          You need to be logged in to access this feature
        </Typography>
        <Typography variant="body1" gutterBottom style={{ color: '#CCCCCC' }}>
          Sign-up with email with a free account to explore
        </Typography>
        <Grid container spacing={2} justifyContent="center" mt={2}>
          <Grid item>
            <Button variant="contained" color="primary" s tyle={{ backgroundColor: '#3B82F6', minWidth: '100px' }} onClick={handleSignUp}>
              Sign Up
            </Button>
          </Grid>
          <Grid item>
            <Button variant="outlined" style={{ color: '#3B82F6', borderColor: '#3B82F6', minWidth: '100px' }} onClick={handleSignIn}>
              Sign In
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default NoAuthorityPage;
