import React from 'react';
import { Grid, Paper, Typography, Box, CircularProgress } from '@mui/material';
import { green, red } from '@mui/material/colors';

const data = [
  { day: '3', value: '-1.01K USDT', type: 'loss' },
  { day: '4', value: '+335.18 USDT', type: 'gain' },
  { day: '5', value: '+2.54K USDT', type: 'gain' },
  { day: '6', value: '-10.67K USDT', type: 'loss' },
  { day: '7', value: '+153.97 USDT', type: 'gain' },
  { day: '10', value: '+956.52 USDT', type: 'gain' },
  { day: '11', value: '+12.39 USDT', type: 'gain' },
  { day: '12', value: '+764.06 USDT', type: 'gain' },
  { day: '13', value: '+3.56K USDT', type: 'gain' },
  { day: '14', value: '+6.63K USDT', type: 'gain' },
  { day: '17', value: '+2.32K USDT', type: 'gain' },
  { day: '18', value: '-1.40K USDT', type: 'loss' },
  { day: '19', value: '+1.77K USDT', type: 'gain' },
  { day: '20', value: '+1.47K USDT', type: 'gain' },
  { day: '21', value: '+2.54K USDT', type: 'gain' },
  { day: '22', value: '-1.05K USDT', type: 'loss' },
  { day: '23', value: '+1.07K USDT', type: 'gain' },
  { day: '24', value: '-211.36 USDT', type: 'loss' },
  { day: '25', value: '+2.15K USDT', type: 'gain' },
  { day: '26', value: '+2.31K USDT', type: 'gain' },
  { day: '27', value: '-1.01K USDT', type: 'loss' },
  { day: '28', value: '+716.90 USDT', type: 'gain' },
  { day: '29', value: '-495.82 USDT', type: 'loss' },
  { day: '30', value: '-722.55 USDT', type: 'loss' },
  { day: '31', value: '-439.55 USDT', type: 'loss' },
];

const stats = {
  netProfit: '20.59K USDT',
  historicalProfitLossRatio: 1.46,
  winRate: 57.42,
  lossRate: 42.58,
  riskRewardRatio: 1.09,
  avgProfit: 541.19,
  avgLoss: 498.26,
};

const ProfitCalendar = () => {
  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        盈亏日历
      </Typography>
      <Grid container spacing={3}>
        {data.map((item, index) => (
          <Grid item xs={4} sm={3} md={2} key={index}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: item.type === 'gain' ? green[100] : red[100],
                borderColor: item.type === 'gain' ? green[700] : red[700],
                borderWidth: 1,
                borderStyle: 'solid',
              }}
            >
              <Typography variant="h6">{item.day}</Typography>
              <Typography variant="body1" color={item.type === 'gain' ? green[700] : red[700]}>
                {item.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Box mt={5}>
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="h5">净盈亏</Typography>
          <Typography variant="h4" color={green[700]}>
            {stats.netProfit}
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="h5">历史总盈亏比</Typography>
          <Typography variant="h4">{stats.historicalProfitLossRatio}</Typography>
        </Paper>
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="h5">胜率</Typography>
          <CircularProgress variant="determinate" value={stats.winRate} />
          <Typography variant="h4">{`${stats.winRate}%`}</Typography>
        </Paper>
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="h5">负率</Typography>
          <CircularProgress variant="determinate" value={stats.lossRate} color="secondary" />
          <Typography variant="h4">{`${stats.lossRate}%`}</Typography>
        </Paper>
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="h5">历史平均风险回报比</Typography>
          <Typography variant="h4">{stats.riskRewardRatio}</Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default ProfitCalendar;
