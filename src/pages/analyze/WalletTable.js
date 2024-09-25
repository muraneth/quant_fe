import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Box, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Dot from 'components/@extended/Dot';

// Comparator and sorting helpers
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

// Table header cells
const headCells = [
  { id: 'wallet_address', align: 'left', label: 'Wallet' },
  { id: 'balance', align: 'left', label: 'Token Balance' },
  { id: 'total_pnl', align: 'left', label: 'Total PNL' },
  { id: 'unrealized_pnl', align: 'left', label: 'Unrealized PNL' },
  { id: 'avg_token_day', align: 'left', label: 'Avg Token Day' },
  {id:'total_txs', align: 'left', label: 'Total Txs' }
];

// Sticky Table Header
function OrderTableHead({ order, orderBy }) {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{
              position: 'sticky',
              top: 0,
              zIndex: 1,
              backgroundColor: 'background.default',
              color: '#fff',
              borderBottom: '2px solid #e0e0e0'
            }}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

OrderTableHead.propTypes = {
  order: PropTypes.string,
  orderBy: PropTypes.string
};

// Status display
const WinStatus = ({ status }) => {
  let color;
  let title;

  switch (status < 0) {
    case true:
      color = 'warning';
      title = 'LOSE';
      break;
    case false:
      color = 'success';
      title = 'WIN';
      break;
  }

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Dot color={color} />
      <Typography>{title}</Typography>
    </Stack>
  );
};

WinStatus.propTypes = {
  status: PropTypes.number
};

// Main Table component
export default function WalletTable() {
  const [order] = useState('desc');
  const [orderBy] = useState('balance');
  const [selected] = useState([]);
  const [data, setData] = useState([]);
  const { symbol } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrades = async () => {
      const token = localStorage.getItem('token');
      const uid = localStorage.getItem('uid');
      const url = `http://127.0.0.1:5005/api/data/topWallet`;
      try {
        const postData = {
          token_symbol: symbol,
          order_by: 'balance'
        };
        const response = await axios.post(url, postData, {
          headers: {
            Authorization: `${token}`,
            Uid: `${uid}`
          }
        });
        setData(response.data.data || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTrades();
  }, [symbol]);

  const isSelected = (walletAddress) => selected.indexOf(walletAddress) !== -1;
  const handleCellClick = (walletAddress) => {
    navigate(`/analyze/${symbol}/wallet/${walletAddress}`);
  };
  return (
    <Box>
      <TableContainer
        sx={{
          width: '100%',
          maxHeight: '800px', // Set max height for the table container
          overflowY: 'auto', // Enable vertical scrolling
          position: 'relative',
          maxWidth: '100%',
          '& td, & th': { whiteSpace: 'nowrap' }
        }}
      >
        <Table
          aria-labelledby="tableTitle"
          sx={{
            '& .MuiTableCell-root:first-of-type': {
              pl: 2
            },
            '& .MuiTableCell-root:last-of-type': {
              pr: 3
            }
          }}
        >
          <OrderTableHead order={order} orderBy={orderBy} />
          <TableBody>
            {stableSort(data, getComparator(order, orderBy)).map((row, index) => {
              const isItemSelected = isSelected(row.wallet_address);
              const labelId = `enhanced-table-checkbox-${index}`;

              return (
                <TableRow
                  hover
                  role="checkbox"
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={row.wallet_address}
                  selected={isItemSelected}
                >
                  <TableCell
                    component="th"
                    id={labelId}
                    scope="row"
                    align="left"
                    onClick={() => handleCellClick(row.wallet_address)} // Handle click for navigation
                    sx={{ cursor: 'pointer', color: 'green' }}
                  >
                    {row.wallet_address}
                  </TableCell>
                  <TableCell align="left">{row.balance}</TableCell>
                  <TableCell align="left">{row.total_pnl}</TableCell>
                  <TableCell align="left">{row.unrealized_pnl}</TableCell>
                  <TableCell align="left">{row.avg_token_day}</TableCell>
                  <TableCell  align="left">{row.total_txs}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
