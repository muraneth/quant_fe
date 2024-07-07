import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';
import { use } from 'echarts';

const columns = [
  { id: 'instId', label: 'Token', minWidth: 80, align: 'left', format: (value) => value.slice(0, -5) },
  {
    id: 'cTime',
    label: 'Created At',
    minWidth: 80,
    align: 'left',
    format: (value) => new Date(Number(value)).toLocaleString('en-ZH', { hour12: false })
  },
  {
    id: 'pos',
    label: 'Position',
    minWidth: 80,
    align: 'left'
    // format: (value) => Number(value).toFixed(2)
  },
  {
    id: 'lever',
    label: 'Lever',
    minWidth: 80,
    align: 'left'
  },

  {
    id: 'idxPx',
    label: 'IdxPx',
    minWidth: 80,
    align: 'left',
    format: (value) => Number(value).toFixed(8)
  },

  {
    id: 'avgPx',
    label: 'AvgPx',
    minWidth: 80,
    align: 'left',
    format: (value) => Number(value).toFixed(8)
  },
  {
    id: 'liqPx',
    label: 'LiqPx',
    minWidth: 80,
    align: 'left',
    format: (value) => Number(value).toFixed(8)
  },

  {
    id: 'posSide',
    label: 'Side',
    minWidth: 80,
    align: 'left'
  },
  {
    id: 'upl',
    label: 'UPnL',
    minWidth: 80,
    align: 'left',
    format: (value) => Number(value).toFixed(2)
  },
  {
    id: 'realizedPnl',
    label: 'RPnL',
    minWidth: 80,
    align: 'left',
    format: (value) => Number(value).toFixed(2)
  },
  {
    id: 'uplRatio',
    label: 'Upl Ratio',
    minWidth: 80,
    align: 'left',
    format: (value) => (Number(value) * 100).toFixed(2) + '%'
  }
];

const PositionTable = ({ accountId }) => {
  const [positions, setPositions] = useState([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const url = `https://matrixcipher.com/api/admin/getPositions?accountId=${accountId}`;

        const uid = localStorage.getItem('uid');
        const token = localStorage.getItem('token');
        if (!uid || !token) {
          navigate('/sign-in');
        }

        const response = await axios.get(url, {
          headers: {
            Authorization: `${token}`,
            Uid: `${uid}`
          }
        });
        if (response.data.code !== 0) {
          return <Alert severity="error">{response.data.msg}</Alert>;
        }
        setPositions(response.data.data ? response.data.data : []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // fetchPositions();
    const intervalId = setInterval(fetchPositions, 3000); // Call fetchPositions every 3000ms (3 second)

    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, []);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const url = `https://matrixcipher.com/api/admin/getBalance?accountId=${accountId}`;

        const uid = localStorage.getItem('uid');
        const token = localStorage.getItem('token');
        if (!uid || !token) {
          navigate('/sign-in');
        }

        const response = await axios.get(url, {
          headers: {
            Authorization: `${token}`,
            Uid: `${uid}`
          }
        });
        if (response.data.code !== 0) {
          return <Alert severity="error">{response.data.msg}</Alert>;
        }
        setBalance(response.data.data ? response.data.data : 0);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    const intervalId = setInterval(fetchBalance, 3500);

    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography variant="h5" component="div" sx={{ pl: 2 }}>
          {accountId}
        </Typography>
        <Typography variant="body6" component="div" sx={{ pl: 2 }}>
          ( Balance: {balance.toFixed(2)}$)
        </Typography>
      </Stack>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                  sx={{ color: 'gray', fontSize: '1.0rem' }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {positions.map((row) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format ? column.format(value) : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default PositionTable;
