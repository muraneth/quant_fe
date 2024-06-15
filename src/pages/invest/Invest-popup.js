/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  DialogTitle,
  DialogActions,
  Button,
  TextField,
  DialogContent,
  FormControl,
  Typography,
  Select,
  MenuItem,
  Box,
  Link,
  Dialog,
  InputLabel
} from '@mui/material';

import axios from 'axios';
import { styled } from '@mui/system';
import { set } from 'lodash';

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  margin: '10px 0',
  minWidth: 200
}));

const CustomDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    minWidth: '400px', // Set the minimum width you want for the dialog
    maxWidth: '700px' // Optionally set a maximum width
  }
}));

const InvestPopup = ({ open, handleClose, product }) => {
  const [userBalance, setUserBalance] = useState(0);
  const [amount, setAmount] = useState(0);
  const [isErr, setIsErr] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const HandleCancel = () => {
    setAmount(0);
    setIsErr(false);
    setErrorMessage('');
    handleClose();
  };
  const handleInvest = async () => {
    // Convert the amount to a number
    const numericAmount = parseFloat(amount);

    // Check if the amount exceeds the available balance
    if (numericAmount > userBalance.avaliable_balance) {
      setIsErr(true);
      setErrorMessage(`Amount exceeds your available balance, current balance is ${userBalance.avaliable_balance}`);
      return;
    }
    // Reset error state
    setIsErr(false);
    setErrorMessage('');

    // Get user ID and token from local storage
    const uid = localStorage.getItem('uid');
    const token = localStorage.getItem('token');

    try {
      // Send a POST request to the invest API
      const response = await axios.post(
        'http://matrixcipher.com/api/invest/invest',
        {
          product_symbol: product,
          amount: numericAmount
        },
        {
          headers: {
            Authorization: `${token}`,
            Uid: `${uid}`
          }
        }
      );
      // Check the response code
      if (response.data.code !== 0) {
        setIsErr(true);
        setErrorMessage(response.data.msg);
        return;
      }
    } catch (error) {
      console.error(error);
    }

    // Close the modal
    handleClose();
  };

  useEffect(() => {
    if (open) {
      const fetchUserInfo = async () => {
        const uid = localStorage.getItem('uid');
        const token = localStorage.getItem('token');

        try {
          const response = await axios.get('http://matrixcipher.com/api/user/asset/getAccountBalance', {
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
    }
  }, [open]);

  return (
    <div>
      <CustomDialog open={open} onClose={handleClose}>
        <DialogTitle>Invest into strategy</DialogTitle>
        <DialogContent>
          <Box component="form" noValidate autoComplete="off">
            <TextField
              fullWidth
              label="Invest Amount USDT"
              margin="dense"
              value={amount}
              error={isErr}
              helperText={errorMessage}
              onChange={(e) => setAmount(e.target.value)}
            />
          </Box>
          <Typography variant="subtitle1">Your available balance: {userBalance.avaliable_balance} USDT</Typography>
          <Box mt={3}>
            <Typography variant="subtitle1">- Summary -</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={HandleCancel} color="primary">
            Cancel
          </Button>
          <Button variant="contained" onClick={handleInvest} color="primary">
            Commit
          </Button>
        </DialogActions>
      </CustomDialog>
    </div>
  );
};

export default InvestPopup;
