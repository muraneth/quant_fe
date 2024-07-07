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
import Alert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';

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
    id: 'amount',
    label: 'Amount',
    minWidth: 80,
    align: 'left'
    // format: (value) => Number(value).toFixed(2)
  },

  {
    id: 'price',
    label: 'Price',
    minWidth: 80,
    align: 'left',
    format: (value) => Number(value).toFixed(8)
  },

  {
    id: 'direction',
    label: 'Direction',
    minWidth: 80,
    align: 'left'
  },
  {
    id: 'action',
    label: 'Action',
    minWidth: 80,
    align: 'left'
    // format: (value) => Number(value).toFixed(2)
  }
];

const SystemOrderTable = ({ accountId }) => {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const url = `https://matrixcipher.com/api/admin/getSystemOrders?accountId=${accountId}`;

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
    const intervalId = setInterval(fetchPositions, 3000); // Call fetchPositions every 1000ms (1 second)

    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, []);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
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

export default SystemOrderTable;
