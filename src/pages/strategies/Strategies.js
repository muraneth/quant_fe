/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import axios from 'axios';

// import { RiseOutlined, FallOutlined } from '@ant-design/icons';
import React from 'react';
import { Box, Grid } from '@mui/material';

import StrategyCard from './Strategy-card';

const Strategies = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const token = localStorage.getItem('token');
    const uid = localStorage.getItem('uid');
    const host = 'http://matrixcipher.com';
    const response = await axios.get(`${host}/api/product/getAll`, {
      headers: {
        Authorization: token,
        Uid: uid
      }
    });
    setProducts(response.data.data);
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3, minHeight: '100vh' }}>
      <Grid container spacing={2}>
        {products.map((strategy, index) => (
          <Grid item xs={12} md={6} key={index}>
            <StrategyCard strategy={strategy} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Strategies;
