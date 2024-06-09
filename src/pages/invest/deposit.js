import React, { useState } from 'react';
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
  FormControl
} from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  dialogContent: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  formControl: {
    margin: '10px 0',
    minWidth: 200
  },
  qrCode: {
    marginTop: '20px',
    width: '150px',
    height: '150px'
  }
});

const DepositCryptoPopup = () => {
  const [open, setOpen] = useState(false);
  const [coin, setCoin] = useState('USDT');
  const [network, setNetwork] = useState('Arbitrum One');
  const classes = useStyles();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Open Deposit Popup
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Deposit Crypto</DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <FormControl className={classes.formControl}>
            <InputLabel>Coin</InputLabel>
            <Select value={coin} onChange={(e) => setCoin(e.target.value)}>
              <MenuItem value="USDT">USDT TetherUS</MenuItem>
              {/* Add more coins as needed */}
            </Select>
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel>Network</InputLabel>
            <Select value={network} onChange={(e) => setNetwork(e.target.value)}>
              <MenuItem value="Arbitrum One">Arbitrum One</MenuItem>
              {/* Add more networks as needed */}
            </Select>
          </FormControl>
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
          <img src="path/to/your/qr-code.png" alt="QR Code" className={classes.qrCode} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DepositCryptoPopup;
