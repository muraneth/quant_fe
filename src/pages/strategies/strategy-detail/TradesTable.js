import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Link, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { NumericFormat } from 'react-number-format';
import Dot from 'components/@extended/Dot';
import axios from 'axios';

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
    id: 'trading-date',
    align: 'left',
    disablePadding: false,
    label: 'Date'
  },
  {
    id: 'token',
    align: 'left',
    disablePadding: true,
    label: 'Token Name'
  },
  {
    id: 'direction',
    align: 'right',
    disablePadding: false,
    label: 'Direction'
  },
  {
    id: 'open-px',
    align: 'left',
    disablePadding: false,
    label: 'OpenPx'
  },
  {
    id: 'close-px',
    align: 'right',
    disablePadding: false,
    label: 'ClosePx'
  },
  {
    id: 'pnl-ratio',
    align: 'right',
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

export default function TradeTable({ productId }) {
  const [order] = useState('asc');
  const [orderBy] = useState('trackingNo');
  const [selected] = useState([]);
  const [trades, setTrades] = useState([]);
  useEffect(() => {
    const fetchTrades = async () => {
      const url = `http://matrixcipher.com/api/product/getProductTrades?productId=${productId}`;
      try {
        const response = await axios.get(url);
        setTrades(response.data.data ? response.data.data : []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTrades();
  }, []);

  const isSelected = (trackingNo) => selected.indexOf(trackingNo) !== -1;

  return (
    <Box>
      <TableContainer
        sx={{
          width: '100%',
          maxHeight: '400px', // Set max height for the table container
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
            {stableSort(trades, getComparator(order, orderBy)).map((row, index) => {
              const isItemSelected = isSelected(row.trade_id);
              const labelId = `enhanced-table-checkbox-${index}`;

              return (
                <TableRow
                  hover
                  role="checkbox"
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={row.trade_id}
                  selected={isItemSelected}
                >
                  <TableCell component="th" id={labelId} scope="row" align="left">
                    <Link color="secondary" component={RouterLink} to="">
                      {row.c_time_date}
                    </Link>
                  </TableCell>
                  <TableCell align="left">{row.uly}</TableCell>
                  <TableCell align="right">{row.direction}</TableCell>
                  <TableCell align="left">{row.open_avg_px}</TableCell>
                  <TableCell align="right">{row.close_avg_px}</TableCell>
                  <TableCell align="right">
                    <NumericFormat value={row.pnl_ratio} displayType="text" thousandSeparator suffix="%" />
                  </TableCell>
                  <TableCell align="left">
                    <WinStatus status={row.pnl_ratio} />
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
