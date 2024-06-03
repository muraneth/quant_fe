import { Button } from '@mui/material';
import axios from 'axios';

import { useState } from 'react';
const Billing = () => {
  const url = 'http://matrixcipher.com/api/user/asset/getDepositeAddress';

  const token = localStorage.getItem('token');
  const uid = localStorage.getItem('uid');
  const [depositAddr, setDepositAddr] = useState('');
  const [depositChain, setDepositChain] = useState('');
  const fetchData = async () => {
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `${token}`,
          Uid: `${uid}`
        }
      });
      setDepositAddr(response.data.data[0].addr);
      setDepositChain(response.data.data[0].chain);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div>
      <h1>Deposit</h1>

      <Button onClick={fetchData} variant="contained" color="success">
        Get Deposit Address
      </Button>
      <p>Deposit Chain: {depositChain}</p>
      <p>Deposit Address: {depositAddr}</p>
    </div>
  );
};
export default Billing;
