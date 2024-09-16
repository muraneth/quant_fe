/* eslint-disable no-unused-vars */

import React, { useState, useEffect } from 'react';
import { Button, Typography, Box } from '@mui/material';

import axios from 'axios';
import DepositCryptoPopup from '../../../../pages/invest/deposit-popup';

const Deposit = () => {
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [userBalance, setUserBalance] = useState({});
  const handleOpenPopup = () => {
    setIsDepositOpen(true);
  };
  const handleClosePopup = () => {
    setIsDepositOpen(false);
  };
  useEffect(() => {
    const fetchUserInfo = async () => {
      const uid = localStorage.getItem('uid');
      const token = localStorage.getItem('token');

      try {
        const response = await axios.get('https://matrixcipher.com/api/user/asset/getAccountBalance', {
          headers: {
            Authorization: `${token}`,
            Uid: `${uid}`
          }
        });

        setUserBalance(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserInfo();
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        // backgroundColor: '#2a2a2a',
        padding: '1px 1px',
        borderRadius: '5px',
        width: '450px',
        margin: 'auto',
        color: 'grey'
      }}
    >
      <Box>
        <Typography variant="body1">Portfolio: ${userBalance.in_position_balance}</Typography>
        <Typography variant="body1">Available: ${userBalance.avaliable_balance}</Typography>
      </Box>
      <Button
        color="primary"
        variant="outlined"
        sx={
          {
            // bgcolor: 'secondary.main',
            // color: 'white',
            // '&:hover': {
            //   bgcolor: 'secondary.light'
            // }
          }
        }
        onClick={handleOpenPopup}
      >
        Deposit
      </Button>
      <DepositCryptoPopup open={isDepositOpen} handleClose={handleClosePopup} />
    </Box>
  );
};
export default Deposit;
