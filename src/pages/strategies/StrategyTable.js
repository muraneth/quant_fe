import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Grid,
  TableHead,
  TableRow,
  Typography,
  Card,
  Button,
  Link
} from '@mui/material';
import { styled } from '@mui/material/styles';

import Dot from 'components/@extended/Dot';
import axios from 'axios';
import PnlRatioChart from './components/Pnl-Ratiao-Chart';

import ChevronRightIcon from '@mui/icons-material/ChevronRight';

// ==============================|| ORDER TABLE - HEADER CELL ||============================== //

const headCells = [
  {
    id: 'strategy',
    align: 'left',
    disablePadding: false,
    label: 'Strategy'
  },
  {
    id: 'apy',
    align: 'left',
    disablePadding: true,
    label: 'Apy'
  },
  {
    id: 'mdd',
    align: 'left',
    disablePadding: true,
    label: 'Max Drawdown'
  },
  // {
  //   id: 'three-month',
  //   align: 'center',
  //   disablePadding: false,
  //   label: '3 Month Data'
  // },
  {
    id: 'all-time',
    align: 'center',
    disablePadding: false,
    label: 'All Time Data'
  },
  {
    id: 'status',
    align: 'left',
    disablePadding: false,
    label: ''
  }
];

// ==============================|| ORDER TABLE - HEADER ||============================== //

function OrderTableHead() {
  return (
    <TableHead>
      <TableRow>
        {headCells?.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            // sortDirection={orderBy === headCell.id ? order : false}
            sx={{ color: '#fff', fontSize: '1.2rem' }}
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

const ColoredTypography = styled(Typography)(({ theme, value }) => ({
  color: value < 0 ? theme.palette.error.main : theme.palette.green.main
}));

const ProductDataPreview = ({ data }) => (
  <Grid item xs={12} md={6} lg={3}>
    {['trade_count', 'pnl_ratio', 'profit_ratio', 'win_ratio'].map((key, i) => (
      <Grid item container direction="row" alignItems="center" key={i}>
        <Typography variant="body2">{`${key.replace('_', ' ').replace(/\b\w/g, (char) => char.toUpperCase())}: `}</Typography>
        <ColoredTypography value={data?.[key]}>
          {key === 'trade_count' ? data?.[key] || 'N/A' : `${data?.[key] || 'N/A'}%`}
        </ColoredTypography>
      </Grid>
    ))}
  </Grid>
);

// ==============================|| ORDER TABLE ||============================== //

export default function StrategyTable({ productId }) {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const token = localStorage.getItem('token');
    const uid = localStorage.getItem('uid');
    const host = 'https://matrixcipher.com';
    const response = await axios.get(`${host}/api/product/getAll`, {
      headers: {
        Authorization: token,
        Uid: uid
      }
    });
    setProducts(response.data.data);
  };
  const [selected] = useState([]);

  const isSelected = (trackingNo) => selected.indexOf(trackingNo) !== -1;

  const handleInvest = (value) => {
    const uid = localStorage.getItem('uid');
    const token = localStorage.getItem('token');
    if (uid && token) {
      navigate(`/invest/${value}`);
    } else {
      navigate('/sign-in');
    }
  };

  return (
    <Box>
      <TableContainer
        sx={{
          width: '100%',
          // maxHeight: '400px', // Set max height for the table container
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
          <OrderTableHead />
          <TableBody>
            {products.map((row, index) => {
              const isItemSelected = isSelected(row.symbol);
              const labelId = `enhanced-table-checkbox-${index}`;

              return (
                <TableRow
                  hover
                  role="checkbox"
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={row.symbol}
                  selected={isItemSelected}
                >
                  <TableCell component="th" id={labelId} scope="row" align="left">
                    <Link color="secondary" href="" variant="body1" onClick={() => navigate(`/strategies/${row.symbol}`)}>
                      {row.name}
                    </Link>
                  </TableCell>
                  <TableCell align="left" sx={{ color: '#fff' }}>
                    <ColoredTypography variant="h6" value={row.apy}>
                      {row.apy}%
                    </ColoredTypography>
                  </TableCell>
                  <TableCell align="left">
                    <ColoredTypography value={-row.mdd}>{-row.mdd}%</ColoredTypography>
                  </TableCell>
                  {/* <TableCell align="left" sx={{ color: '#fff' }}>
                    <Stack direction="row">
                      <ProductDataPreview data={row} />
                      <Grid item xs={12} md={6} lg={3}>
                        <PnlRatioChart slot="month3" product={row.symbol} />
                      </Grid>
                    </Stack>

                  </TableCell> */}

                  <TableCell align="left" sx={{ color: '#fff' }}>
                    <Stack direction="row">
                      <ProductDataPreview data={row} />
                      <Grid item xs={12} md={6} lg={3}>
                        <PnlRatioChart slot="all" product={row.symbol} />
                      </Grid>
                    </Stack>
                  </TableCell>
                  <TableCell align="right" sx={{ color: '#fff' }}>
                    {/* <WinStatus status={row.pnl_ratio} />
                     */}
                    <Stack direction="column" spacing={1} alignItems="center">
                      <Button
                        variant="contained"
                        // href={`/strategies/${row.symbol}`}
                        size="large"
                        sx={{ color: 'primary.main', bgcolor: 'secondary.main', '&:hover': { bgcolor: 'secondary.light' } }}
                        onClick={() => handleInvest(row.symbol)}
                      >
                        Invest
                      </Button>
                      <Button
                        variant="text"
                        size="large"
                        endIcon={<ChevronRightIcon />}
                        sx={{ color: 'secondary.main' }}
                        href={`/strategies/${row.symbol}`}
                      >
                        Info
                      </Button>
                    </Stack>
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
