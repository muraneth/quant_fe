import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
// import { Link as RouterLink } from 'react-router-dom';
import { Box, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { NumericFormat } from 'react-number-format';
import Dot from 'components/@extended/Dot';
import axios from 'axios';
import { useParams } from 'react-router-dom';

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

// ==============================|| ORDER TABLE - HEADER CELL ||============================== //

const headCells = [
  {
    id: 'wallet_address',
    align: 'left',
    disablePadding: false,
    label: 'Wallet'
  },
  {
    id: 'token',
    align: 'left',
    disablePadding: true,
    label: 'Token Name'
  },
  {
    id: 'direction',
    align: 'left',
    disablePadding: false,
    label: 'Direction'
  },
  {
    id: 'pnl-ratio',
    align: 'left',
    disablePadding: false,
    label: 'PNL Ratio'
  },
  {
    id: 'status',
    align: 'left',
    disablePadding: false,
    label: 'WIN/LOSE'
  }
];

// ==============================|| ORDER TABLE - HEADER ||============================== //

function OrderTableHead({ order, orderBy }) {
  return (
    <TableHead>
      <TableRow>
        {headCells?.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{ color: '#fff' }}
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

// ==============================|| ORDER TABLE - STATUS ||============================== //

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
    // case 2:
    //   color = 'error';
    //   title = 'Rejected';
    //   break;
    // default:
    //   color = 'primary';
    //   title = 'None';
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

// ==============================|| ORDER TABLE ||============================== //

export default function WalletTable() {
  const [order] = useState('desc');
  const [orderBy] = useState('balance');
  const [selected] = useState([]);
  const [data, setData] = useState([]);
  const { symbol } = useParams();

  useEffect(() => {
    const fetchTrades = async () => {
      const token = localStorage.getItem('token');
      const uid = localStorage.getItem('uid');
      const url = `http://127.0.0.1:5005/api/data/topWallet`;
      try {
        const postData = {
          token_symbol: `${symbol}`,
          order_by: 'balance'
        };
        const response = await axios.post(url, postData, {
          headers: {
            Authorization: `${token}`,
            Uid: `${uid}`
          }
        });
        setData(response.data.data ? response.data.data : []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTrades();
  }, [symbol]);

  const isSelected = (trackingNo) => selected.indexOf(trackingNo) !== -1;

  return (
    <Box>
      <TableContainer
        sx={{
          width: '100%',
          maxHeight: '800px', // Set max height for the table container
          overflowY: 'auto', // Enable vertical scrolling
          position: 'relative',
          display: 'block',
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
                  <TableCell component="th" id={labelId} scope="row" align="left">
                    {/* <Link color="secondary" component={RouterLink} to=""> */}
                    {row.wallet_address}
                    {/* </Link> */}
                  </TableCell>
                  <TableCell align="left">{row.balance}</TableCell>
                  <TableCell align="left">{row.total_pnl}</TableCell>

                  <TableCell align="left">
                    {/* <NumericFormat value={row.unrealiazed_pnl} displayType="text" thousandSeparator suffix="%" /> */}
                    {row.unrealiazed_pnl}
                  </TableCell>
                  <TableCell align="left">
                    {/* <WinStatus status={row.avg_token_day} /> */}
                    {row.avg_token_day}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
