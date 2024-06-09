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
const DepositCryptoPopup = ({ open, handleClose }) => {
  const [coin, setCoin] = useState('USDT');
  const [network, setNetwork] = useState('Arbitrum One');

  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    const generateQrCode = async () => {
      try {
        const url = await QRCode.toDataURL('0x13f3067f697eb6e24c790ad6a21058aa8fd275c0');
        setQrCodeUrl(url);
      } catch (err) {
        console.error(err);
      }
    };

    generateQrCode();
  }, []);

  return (
    <div>
      {/* <Button variant="contained" color="primary" onClick={handleOpen}>
        Open Deposit Popup
      </Button> */}
      <Dialog open={open} onClose={handleClose}>
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
            <Select value={network} onChange={(e) => setNetwork(e.target.value)}>
              <MenuItem value="Arbitrum One">Arbitrum One</MenuItem>
              {/* Add more networks as needed */}
            </Select>
          </StyledFormControl>
          <TextField
            label="Deposit Address"
            value="0x13f3067f697eb6e24c790ad6a21058aa8fd275c0"
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
      </Dialog>
    </div>
  );
};
