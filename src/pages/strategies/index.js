import * as React from 'react';
import { Container, Stack } from '@mui/material';
import Strategies from './Strategies';
import Header from 'layout/MainLayout/Header/index';
export default function StrategiesPage() {
  return (
    <>
      <Stack
        component="main"
        direction="column"
        justifyContent="space-between"
        sx={(theme) => ({
          backgroundRepeat: 'no-repeat',
          backgroundImage: 'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 16%), transparent)',
          pb: { xs: 12, sm: 0 }
        })}
      >
        <Header />

        <Strategies />
      </Stack>
    </>
  );
}
