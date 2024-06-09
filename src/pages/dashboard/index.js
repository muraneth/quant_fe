/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';

// material-ui
import { Box, Button, Grid, Stack, Typography } from '@mui/material';

import AcumPnlAraeChart from './PnlAreaChart';
import WeeklyPnlBarChart from './WeeklyPnlBarChart';
import BalanceAraeChart from './BalanceAreaChart';

// import SalesColumnChart from './SalesColumnChart';
import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

const DashboardDefault = () => {
  const [slot, setSlot] = useState('month');
  const [userDailyCashFlowData, setUserDailyCashFlowData] = useState([]);
  const [userWeeklyCashFlowData, setUserWeeklyCashFlowData] = useState([]);
  const navigate = useNavigate();
  const host = 'http://matrixcipher.com';
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const uid = localStorage.getItem('uid');
        const response = await axios.get(`${host}/api/user/asset/getAllHistoryCashFlow`, {
          headers: {
            Authorization: `${token}`,
            Uid: `${uid}`
          }
        });

        setUserDailyCashFlowData(response.data.data?.daily_cash_flow);
        setUserWeeklyCashFlowData(response.data.data?.weekly_cash_flow);
      } catch (error) {
        console.error('Error fetching data:', error);
        navigate('/sign-in', { replace: true });
      }
    };

    fetchData();
  }, []);

  const lastRecord = userDailyCashFlowData.length > 0 ? userDailyCashFlowData[userDailyCashFlowData.length - 1] : null;

  const recent7WeekPnl =
    userWeeklyCashFlowData.length > 7 ? userWeeklyCashFlowData.slice(userWeeklyCashFlowData.length - 7) : userWeeklyCashFlowData;
  const isLoss = lastRecord ? lastRecord.daily_pnl_ratio < 0 : false;

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* row 1 */}
      <Grid item xs={12} sx={{ mb: -2.25 }}>
        <Typography variant="h5">Dashboard</Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={3} lg={3}>
        <AnalyticEcommerce
          title="Current balance"
          count={`$${lastRecord ? lastRecord.balance : 0}`}
          // percentage={lastRecord ? lastRecord.daily_pnl_ratio : 0}
          extra={`$${lastRecord ? lastRecord.daily_pnl : 0}`}
          isLoss={isLoss}
          // color= {isLoss ? 'warning' : 'success'}
          msg="daily banlane change"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3} lg={3}>
        <AnalyticEcommerce
          title="Accumulative PNL"
          count={`$${lastRecord ? lastRecord.acum_pnl : 0}`}
          // percentage={lastRecord ? lastRecord.daily_pnl_ratio : 0}
          extra={`$${lastRecord ? lastRecord.daily_pnl : 0}`}
          isLoss={isLoss}
          // color= {isLoss ? 'warning' : 'success'}
          msg="daily pnl change"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3} lg={3}>
        <AnalyticEcommerce
          title="Accumulative PNLRatio"
          count={`${lastRecord ? lastRecord.acum_pnl_ratio : 0}%`}
          extra={`$${lastRecord ? lastRecord.daily_pnl_ratio : 0}%`}
          msg="daily pnl ratio"
        />
      </Grid>
      {/* <Grid item xs={12} sm={6} md={3} lg={3}>
          <AnalyticEcommerce title="Expected Annual PNLRatio " 
          count={`${userAssetBaseInfo.acum_pnl_ratio}%`}
          // percentage={27.4} 
          // isLoss 
          // color="warning"
          // extra="$20,395"
          msg="Based on last 3months PNL ratio"
           />
        </Grid> */}

      <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />

      {/* row 2 pnl ratio */}
      <Grid item xs={16} md={7} lg={12}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Accumulative PNL Ratio</Typography>
          </Grid>
          <Grid item>
            <Stack direction="row" alignItems="center" spacing={0}>
              <Button
                size="small"
                onClick={() => setSlot('all')}
                color={slot === 'all' ? 'primary' : 'secondary'}
                variant={slot === 'all' ? 'outlined' : 'text'}
              >
                ALL
              </Button>
              <Button
                size="small"
                onClick={() => setSlot('month')}
                color={slot === 'month' ? 'primary' : 'secondary'}
                variant={slot === 'month' ? 'outlined' : 'text'}
              >
                Month
              </Button>
              <Button
                size="small"
                onClick={() => setSlot('week')}
                color={slot === 'week' ? 'primary' : 'secondary'}
                variant={slot === 'week' ? 'outlined' : 'text'}
              >
                Week
              </Button>
            </Stack>
          </Grid>
        </Grid>
        <MainCard content={false} sx={{ mt: 1.5, bgcolor: '#1e1e2d' }}>
          <Box sx={{ pt: 1, pr: 2 }}>
            <AcumPnlAraeChart slot={slot} />
          </Box>
        </MainCard>
      </Grid>

      {/* row 2 balance */}
      <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">History Balance</Typography>
          </Grid>
          <Grid item>
            <Stack direction="row" alignItems="center" spacing={0}>
              <Button
                size="small"
                onClick={() => setSlot('all')}
                color={slot === 'all' ? 'primary' : 'secondary'}
                variant={slot === 'all' ? 'outlined' : 'text'}
              >
                ALL
              </Button>
              <Button
                size="small"
                onClick={() => setSlot('month')}
                color={slot === 'month' ? 'primary' : 'secondary'}
                variant={slot === 'month' ? 'outlined' : 'text'}
              >
                Month
              </Button>
              <Button
                size="small"
                onClick={() => setSlot('week')}
                color={slot === 'week' ? 'primary' : 'secondary'}
                variant={slot === 'week' ? 'outlined' : 'text'}
              >
                Week
              </Button>
            </Stack>
          </Grid>
        </Grid>
        <MainCard content={false} sx={{ mt: 1.5, bgcolor: '#1e1e2d' }}>
          <Box sx={{ pt: 1, pr: 2 }}>
            <BalanceAraeChart slot={slot} />
          </Box>
        </MainCard>
      </Grid>
      <Grid item xs={12} md={5} lg={4}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Recent Weekly PNL</Typography>
          </Grid>
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 2, bgcolor: '#1e1e2d' }} content={false}>
          <WeeklyPnlBarChart data={recent7WeekPnl} />
        </MainCard>
      </Grid>

      {/* row 3 */}
      {/* <Grid item xs={12} md={7} lg={8}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="h5">Recent Trades</Typography>
            </Grid>
            <Grid item />
          </Grid>
          <MainCard sx={{ mt: 2 }} content={false}>
            <TradeTable />
          </MainCard>
        </Grid> */}
      {/* <Grid item xs={12} md={5} lg={4}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="h5">Analytics Report</Typography>
            </Grid>
            <Grid item />
          </Grid>
          <MainCard sx={{ mt: 2 }} content={false}>
            <List sx={{ p: 0, '& .MuiListItemButton-root': { py: 2 } }}>
              <ListItemButton divider>
                <ListItemText primary="Company Finance Growth" />
                <Typography variant="h5">+45.14%</Typography>
              </ListItemButton>
              <ListItemButton divider>
                <ListItemText primary="Company Expenses Ratio" />
                <Typography variant="h5">0.58%</Typography>
              </ListItemButton>
              <ListItemButton>
                <ListItemText primary="Business Risk Cases" />
                <Typography variant="h5">Low</Typography>
              </ListItemButton>
            </List>
            <ReportAreaChart />
          </MainCard>
        </Grid> */}

      {/* row 4 */}
      {/* <Grid item xs={12} md={7} lg={8}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="h5">Sales Report</Typography>
            </Grid>
            <Grid item>
              <TextField
                id="standard-select-currency"
                size="small"
                select
                value={value}
                onChange={(e) => setValue(e.target.value)}
                sx={{ '& .MuiInputBase-input': { py: 0.5, fontSize: '0.875rem' } }}
              >
                {status.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
          <MainCard sx={{ mt: 1.75 }}>
            <Stack spacing={1.5} sx={{ mb: -12 }}>
              <Typography variant="h6" color="secondary">
                Net Profit
              </Typography>
              <Typography variant="h4">$1560</Typography>
            </Stack>
            <SalesColumnChart />
          </MainCard>
        </Grid> */}
      <Grid item xs={12} md={5} lg={4}>
        {/* <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="h5">Transaction History</Typography>
            </Grid>
            <Grid item />
          </Grid> */}
        <MainCard sx={{ mt: 2 }} content={false}>
          {/* <List
              component="nav"
              sx={{
                px: 0,
                py: 0,
                '& .MuiListItemButton-root': {
                  py: 1.5,
                  '& .MuiAvatar-root': avatarSX,
                  '& .MuiListItemSecondaryAction-root': { ...actionSX, position: 'relative' }
                }
              }}
            >
              <ListItemButton divider>
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      color: 'success.main',
                      bgcolor: 'success.lighter'
                    }}
                  >
                    <GiftOutlined />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={<Typography variant="subtitle1">Order #002434</Typography>} secondary="Today, 2:00 AM" />
                <ListItemSecondaryAction>
                  <Stack alignItems="flex-end">
                    <Typography variant="subtitle1" noWrap>
                      + $1,430
                    </Typography>
                    <Typography variant="h6" color="secondary" noWrap>
                      78%
                    </Typography>
                  </Stack>
                </ListItemSecondaryAction>
              </ListItemButton>
              <ListItemButton divider>
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      color: 'primary.main',
                      bgcolor: 'primary.lighter'
                    }}
                  >
                    <MessageOutlined />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={<Typography variant="subtitle1">Order #984947</Typography>} secondary="5 August, 1:45 PM" />
                <ListItemSecondaryAction>
                  <Stack alignItems="flex-end">
                    <Typography variant="subtitle1" noWrap>
                      + $302
                    </Typography>
                    <Typography variant="h6" color="secondary" noWrap>
                      8%
                    </Typography>
                  </Stack>
                </ListItemSecondaryAction>
              </ListItemButton>
              <ListItemButton>
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      color: 'error.main',
                      bgcolor: 'error.lighter'
                    }}
                  >
                    <SettingOutlined />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={<Typography variant="subtitle1">Order #988784</Typography>} secondary="7 hours ago" />
                <ListItemSecondaryAction>
                  <Stack alignItems="flex-end">
                    <Typography variant="subtitle1" noWrap>
                      + $682
                    </Typography>
                    <Typography variant="h6" color="secondary" noWrap>
                      16%
                    </Typography>
                  </Stack>
                </ListItemSecondaryAction>
              </ListItemButton>
            </List> */}
        </MainCard>
        {/* <MainCard sx={{ mt: 2 }}>
            <Stack spacing={3}>
              <Grid container justifyContent="space-between" alignItems="center">
                <Grid item>
                  <Stack>
                    <Typography variant="h5" noWrap>
                      Help & Support Chat
                    </Typography>
                    <Typography variant="caption" color="secondary" noWrap>
                      Typical replay within 5 min
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item>
                  <AvatarGroup sx={{ '& .MuiAvatar-root': { width: 32, height: 32 } }}>
                    <Avatar alt="Remy Sharp" src={avatar1} />
                    <Avatar alt="Travis Howard" src={avatar2} />
                    <Avatar alt="Cindy Baker" src={avatar3} />
                    <Avatar alt="Agnes Walker" src={avatar4} />
                  </AvatarGroup>
                </Grid>
              </Grid>
              <Button size="small" variant="contained" sx={{ textTransform: 'capitalize' }}>
                Need Help?
              </Button>
            </Stack>
          </MainCard> */}
      </Grid>
    </Grid>
  );
};

export default DashboardDefault;
