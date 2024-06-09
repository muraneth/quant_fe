import { Grid, Typography } from '@mui/material';

import axios from 'axios';
import { useEffect, useState } from 'react';

const TokenProfitCard = ({ productId }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const uid = localStorage.getItem('uid');

        const response = await axios.get(`http://matrixcipher.com/api/product/getProfitGroupByToken?productId=${productId}`, {
          headers: {
            Authorization: `${token}`,
            Uid: `${uid}`
          }
        });
        setData(response.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [productId]);

  return (
    <>
      {data.map((it, index) => {
        return (
          <Grid item key={index}>
            <Typography variant="h5"> {it.token}</Typography>
            <Typography variant="body2">trades: {it.trade_count} </Typography>
            <Typography variant="body2">profit ratio: {it.profit_ratio}%</Typography>
            <Typography variant="body2">win ratio: {it.win_ratio}%</Typography>
          </Grid>
        );
      })}
    </>
  );
};

export default TokenProfitCard;
