/* eslint-disable no-unused-vars */

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box
} from '@mui/material';
import { styled } from '@mui/system';
import QRCode from 'qrcode';
import axios from 'axios';

const Deposit = () => {
  const [isDepositOpen, setIsDepositOpen] = useState(false);

  const handleOpenPopup = () => {
    setIsDepositOpen(true);
  };
  const handleClosePopup = () => {
    setIsDepositOpen(false);
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <Button variant="outlined" color="primary" onClick={handleOpenPopup}>
        Deposit
      </Button>
      <DepositCryptoPopup open={isDepositOpen} handleClose={handleClosePopup} />
    </Box>
  );
};
export default Deposit;

/* eslint-disable no-unused-vars */

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

const QRCodeImage = styled('img')({
  marginTop: '20px',
  width: '150px',
  height: '150px'
});
const CustomDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    minWidth: '400px', // Set the minimum width you want for the dialog
    maxWidth: '700px' // Optionally set a maximum width
  }
}));
const DepositCryptoPopup = ({ open, handleClose }) => {
  const [coin, setCoin] = useState('USDT');
  const [chain, setChain] = useState('Arbitrum');
  const [userInfo, setUserInfo] = useState({});
  const [address, setAddress] = useState('');

  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const setWallet = (chain) => {
    const wallet = userInfo.wallets.find((wallet) => wallet.chain === chain);
    setChain(chain);
    setAddress(wallet.addr);
  };

  useEffect(() => {
    if (open) {
      const fetchUserInfo = async () => {
        const uid = localStorage.getItem('uid');
        const token = localStorage.getItem('token');

        try {
          const response = await axios.get('http://matrixcipher.com/api/user/info/getUserInfo', {
            headers: {
              Authorization: `${token}`,
              Uid: `${uid}`
            }
          });
          console.log(response.data.data);
          setUserInfo(response.data.data);
          setChain(response.data.data.wallets[0].chain);
          setAddress(response.data.data.wallets[0].addr);
        } catch (error) {
          console.error(error);
        }
      };
      fetchUserInfo();
    }
  }, [open]);

  useEffect(() => {
    const generateQrCode = async (addr) => {
      try {
        const url = await QRCode.toDataURL(addr);
        setQrCodeUrl(url);
      } catch (err) {
        console.error(err);
      }
    };
    generateQrCode(address);
  }, [address]);
  return (
    <div>
      <CustomDialog open={open} onClose={handleClose}>
        <DialogTitle>Deposit Crypto</DialogTitle>
        <StyledDialogContent>
          <StyledFormControl>
            <InputLabel>Coin</InputLabel>
            <Select value={coin} onChange={(e) => setCoin(e.target.value)}>
              <MenuItem value="USDT">USDT TetherUS</MenuItem>
              {/* Add more coins as needed */}
            </Select>
          </StyledFormControl>
          <StyledFormControl>
            <InputLabel>Network</InputLabel>
            <Select value={chain} onChange={(e) => setWallet(e.target.value)}>
              {userInfo?.wallets?.map((wallet, index) => (
                <MenuItem key={index} value={wallet.chain}>
                  {wallet.chain}
                </MenuItem>
              ))}

              {/* Add more networks as needed */}
            </Select>
          </StyledFormControl>
          <TextField
            label="Deposit Address"
            value={address}
            InputProps={{
              readOnly: true
            }}
            fullWidth
            margin="normal"
          />
          <Typography variant="body2" color="error">
            Only send Arbitrum One TetherUS tokens to this address
          </Typography>
          <QRCodeImage src={qrCodeUrl} alt="QR Code" />
        </StyledDialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </CustomDialog>
    </div>
  );
};
