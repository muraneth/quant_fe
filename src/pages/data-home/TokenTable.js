import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Box, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectToken } from 'store/reducers/token';
import { formatBigNumber } from 'utils/common';
import Tab from 'themes/overrides/Tab';

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
  // return (a, b) => descendingComparator(a, b, orderBy);
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
  { id: 'token', align: 'left', label: 'Token' },
  { id: 'mcp', align: 'left', label: 'MarketCap' },
  { id: 'holder', align: 'left', label: 'Holder' },
  // { id: 'holder_chg', align: 'left', label: 'HolderChg' },
  { id: 'mcp_to_holder', align: 'left', label: 'Mcp/Holder' },
  { id: 'price', align: 'left', label: 'Price' },
  { id: 'avg_cost', align: 'left', label: 'AvgCost' },
  { id: 'price_to_avg_cost', align: 'left', label: 'PVA' },
  { id: 'poolsize', align: 'left', label: 'PoolSize' },
  { id: 'poolsize_to_mcp', align: 'left', label: 'PoolSz/Mcp' },
  { id: 'volumn', align: 'left', label: 'Volume' },
  // { id: 'volumn_chg', align: 'left', label: 'VolumeChg' },
  { id: 'volumn_to_mcp', align: 'left', label: 'Volume/Mcp' },
  { id: 'volumn_to_poolsize', align: 'left', label: 'Vol/PoolSz' },
  { id: 'time', align: 'left', label: 'Time' }
];

// Sticky Table Header
function OrderTableHead({ order, orderBy, onRequestSort }) {
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

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
              borderBottom: '2px solid #e0e0e0',
              cursor: 'pointer'
            }}
            onClick={createSortHandler(headCell.id)}
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
  orderBy: PropTypes.string,
  onRequestSort: PropTypes.func.isRequired
};

// Main Table component
export default function TokenTable() {
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('balance');
  const [selected] = useState([]);
  const [data, setData] = useState([]);
  const { symbol } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchTrades = async () => {
      const token = localStorage.getItem('token');
      const uid = localStorage.getItem('uid');
      const url = `http://127.0.0.1:5005/data/api/token/getTokenTable`;
      try {
        const postData = {
          order_by: orderBy
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
  }, [orderBy]);

  const isSelected = (walletAddress) => selected.indexOf(walletAddress) !== -1;
  const handleCellClick = (token) => {
    dispatch(selectToken({ tokenItem: { symbol: token } }));
    localStorage.setItem('selectedToken', { symbol: token });
    navigate(`/chart/${token}/avgCost`);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  return (
    <Box>
      <TableContainer
        sx={{
          width: '100%',
          maxHeight: '800px',
          overflowY: 'auto',
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
          <OrderTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
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
                  key={row.token}
                  selected={isItemSelected}
                >
                  <TableCell
                    component="th"
                    id={labelId}
                    scope="row"
                    align="left"
                    onClick={() => handleCellClick(row.token)}
                    sx={{ cursor: 'pointer', color: 'green' }}
                  >
                    {row.token}
                  </TableCell>
                  <TableCell align="left">{formatBigNumber(row.mcp)}</TableCell>
                  <TableCell align="left">{row.holder}</TableCell>
                  {/* <TableCell align="left">{row.holder_chg}</TableCell> */}
                  <TableCell align="left">{row.mcp_to_holder.toFixed(2)}</TableCell>
                  <TableCell align="left">{row.price.toFixed(8)}</TableCell>
                  <TableCell align="left">{row.avg_cost.toFixed(8)}</TableCell>
                  <TableCell align="left">{row.price_to_avg_cost.toFixed(3)}</TableCell>
                  <TableCell align="left">{formatBigNumber(row.poolsize)}</TableCell>
                  <TableCell align="left">{row.poolsize_to_mcp.toFixed(3)}</TableCell>
                  <TableCell align="left">{formatBigNumber(row.volumn)}</TableCell>
                  <TableCell align="left">{row.volumn_to_mcp.toFixed(3)}</TableCell>
                  <TableCell align="left">{row.volumn_to_poolsize.toFixed(3)}</TableCell>
                  <TableCell align="left">{row.time}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
