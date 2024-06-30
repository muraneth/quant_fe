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
import { common } from '@mui/material/colors';
import axios from 'axios';
import NoAuthorityPage from 'pages/authentication/NoAuthority';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

const DashboardDefault = () => {
  const [slot, setSlot] = useState('all');
  const [userDailyCashFlowData, setUserDailyCashFlowData] = useState([]);
  const [userWeeklyCashFlowData, setUserWeeklyCashFlowData] = useState([]);
  const [authorization, setAuthorization] = useState(true);
  // const navigate = useNavigate();
  const host = 'https://matrixcipher.com';
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
        setAuthorization(true);
      } catch (error) {
        console.error('Error fetching data:', error);
        // navigate('/sign-in', { replace: true });
        setAuthorization(false);
      }
    };

    fetchData();
  }, []);

  const lastRecord = userDailyCashFlowData.length > 0 ? userDailyCashFlowData[userDailyCashFlowData.length - 1] : null;

  const recent7WeekPnl =
    userWeeklyCashFlowData.length > 7 ? userWeeklyCashFlowData.slice(userWeeklyCashFlowData.length - 7) : userWeeklyCashFlowData;
  const isLoss = lastRecord ? lastRecord.daily_pnl_ratio < 0 : false;
  if (authorization === false) {
    return (
      // <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
      <Grid container sx={{ bgcolor: '#0b1836' }}>
        <NoAuthorityPage />
      </Grid>
    );
  } else {
    return (
      <Grid
        container
        rowSpacing={4.5}
        columnSpacing={2.75}
        sx={(theme) => ({
          width: '100%'
          // backgroundImage:
          //   theme.palette.mode === 'light'
          //     ? 'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 90%), transparent)'
          //     : 'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 16%), transparent)',
          // backgroundRepeat: 'no-repeat'
        })}
      >
        {/* row 1 */}
        {/* <Grid item xs={12} sx={{ mb: -2.25 }}>
          <Typography variant="h5">Dashboard</Typography>
        </Grid> */}
        <Grid item xs={12} sm={6} md={3} lg={3}>
          <AnalyticEcommerce
            title="Balance"
            count={`$${lastRecord ? lastRecord.balance : 0}`}
            // percentage={lastRecord ? lastRecord.daily_pnl_ratio : 0}
            extra={`$${lastRecord ? lastRecord.daily_pnl : 0}`}
            isLoss={isLoss}
            color={isLoss ? 'warning' : 'success'}
            msg="daily banlane change"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={3}>
          <AnalyticEcommerce
            title="PNL"
            count={`$${lastRecord ? lastRecord.acum_pnl : 0}`}
            // percentage={lastRecord ? lastRecord.daily_pnl_ratio : 0}
            extra={`$${lastRecord ? lastRecord.daily_pnl : 0}`}
            isLoss={isLoss}
            color={isLoss ? 'warning' : 'success'}
            msg="daily pnl change"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={3}>
          <AnalyticEcommerce
            title="PNLRatio"
            count={`${lastRecord ? lastRecord.acum_pnl_ratio : 0}%`}
            extra={`$${lastRecord ? lastRecord.daily_pnl_ratio : 0}%`}
            isLoss={isLoss}
            color={isLoss ? 'warning' : 'success'}
            msg="daily pnl ratio"
          />
        </Grid>

        <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />

        {/* row 2 pnl ratio */}
        <Grid item xs={16} md={7} lg={12}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="h5">Accumulative PNL Ratio</Typography>
            </Grid>
            <Grid item>
              <Stack direction="row" alignItems="center" spacing={0}>
                <Button size="small" onClick={() => setSlot('all')} color={slot === 'all' ? 'primary' : 'secondary'} variant={'outlined'}>
                  ALL
                </Button>
                <Button
                  size="small"
                  onClick={() => setSlot('month3')}
                  color={slot === 'month3' ? 'primary' : 'secondary'}
                  variant={'outlined'}
                >
                  3Months
                </Button>
                <Button
                  size="small"
                  onClick={() => setSlot('month')}
                  color={slot === 'month' ? 'primary' : 'secondary'}
                  variant={'outlined'}
                >
                  Month
                </Button>
              </Stack>
            </Grid>
          </Grid>
          <MainCard content={false} sx={{ mt: 1.5, bgcolor: 'background.paper' }}>
            <Box sx={{ pt: 1, pr: 2 }}>
              <AcumPnlAraeChart slot={slot} />
            </Box>
          </MainCard>
        </Grid>

        {/* row 2 balance */}
        <Grid item xs={12} md={7} lg={12}>
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
                  onClick={() => setSlot('month3')}
                  color={slot === 'month3' ? 'primary' : 'secondary'}
                  variant={'outlined'}
                >
                  3Months
                </Button>
                <Button
                  size="small"
                  onClick={() => setSlot('month')}
                  color={slot === 'month' ? 'primary' : 'secondary'}
                  variant={'outlined'}
                >
                  Month
                </Button>
              </Stack>
            </Grid>
          </Grid>
          <MainCard content={false} sx={{ mt: 1.5, bgcolor: 'background.paper' }}>
            <Box sx={{ pt: 1, pr: 2 }}>
              <BalanceAraeChart slot={slot} />
            </Box>
          </MainCard>
        </Grid>
        <Grid item xs={12} md={5} lg={12}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="h5">Recent Weekly PNL</Typography>
            </Grid>
            <Grid item />
          </Grid>
          <MainCard sx={{ mt: 2, bgcolor: 'background.paper' }} content={false}>
            <WeeklyPnlBarChart data={userWeeklyCashFlowData} />
          </MainCard>
        </Grid>
      </Grid>
    );
  }
};

export default DashboardDefault;
