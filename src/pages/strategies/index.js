import * as React from 'react';
import { Container, Stack, Box, TableContainer, Card, CardHeader, CardContent, Typography } from '@mui/material';

import Header from 'layout/MainLayout/Header/index';
import axios from 'axios';
import { useEffect, useState } from 'react';

import StrategyTable from './StrategyTable';

import StrategyCardNew from './Strategy-card-new';

const StrategyHeader = () => {
  return (
    <Box sx={{ bgcolor: 'background.default', py: 3 }}>
      <Container>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="column" spacing={1}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Box sx={{ fontSize: 24, fontWeight: 'bold' }}>Strategies</Box>
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default function StrategiesPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const token = localStorage.getItem('token');
    const uid = localStorage.getItem('uid');
    const host = 'https://matrixcipher.com';
    const response = await axios.get(`${host}/api/product/getAll`, {
      headers: {
        Authorization: token,
        Uid: uid
      }
    });
    setProducts(response.data.data);
  };

  return (
    <>
      <Stack
        component="main"
        direction="column"
        justifyContent="space-between"
        // display="flex"
        alignItems="center"
        width="100%"
        sx={(theme) => ({
          backgroundRepeat: 'no-repeat',
          backgroundImage: 'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 16%), transparent)',
          pb: { xs: 12, sm: 0 }
        })}
      >
        <Header />
        <Box sx={{ flexGrow: 1, pt: 10, bgcolor: '#0b1836', color: '#fff' }}>
          <Typography variant="h5" component="div">
            Chose strategies that suit you
          </Typography>
        </Box>
        <Box sx={{ px: 10, pt: 2 }} alignItems="center" width="50%">
          {products.length > 0 && <StrategyCardNew strategy={products[0]} />}
        </Box>
        <Box sx={{ px: 10, width: '100%' }}>
          <StrategyTable />
        </Box>
      </Stack>
    </>
  );
}
