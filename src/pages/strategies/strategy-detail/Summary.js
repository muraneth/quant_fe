import React from 'react';
import { Grid, Typography } from '@mui/material';

const StrategySummary = ({ overview, allocation, features }) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sx={{ textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Strategy Summary
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body1">
          <strong>Overview:</strong> {overview}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body1">
          <strong>Trading Pairs </strong> {allocation}
        </Typography>
      </Grid>
      {/* 
      <Grid item xs={12}>
        <Typography variant="body1">
          <strong>Key Features:</strong> {features}
        </Typography>
      </Grid> */}
    </Grid>
  );
};

export default StrategySummary;
