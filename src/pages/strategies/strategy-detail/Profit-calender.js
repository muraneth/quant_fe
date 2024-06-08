/* eslint-disable no-unused-vars */
import React from 'react';
import { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Box, CircularProgress } from '@mui/material';
import { NumericFormat } from 'react-number-format';

import { green, red, common } from '@mui/material/colors';
import axios from 'axios';

const ProfitCalendar = ({ productId }) => {
  const getColor = (value, level) => {
    if (value > 0) {
      return green[level];
    }
    if (value < 0) {
      return red[level];
    }
    return common.white;
  };
  const [data, setData] = React.useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const uid = localStorage.getItem('uid');

        const response = await axios.get(`http://matrixcipher.com/api/product/getProductCalanderProfit?productId=${productId}`, {
          headers: {
            Authorization: `${token}`,
            Uid: `${uid}`
          }
        });
        setData(response.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <Box p={3}>
      <Grid container spacing={3}>
        {data.map((item, index) => (
          <Grid item xs={4} sm={3} md={2} key={index}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: getColor(item.pnl_ratio, 100),
                // borderColor: item.pnl_ratio >= 0 ? green[700] : red[700],
                borderWidth: 1,
                borderStyle: 'solid'
              }}
            >
              <Typography variant="body3">{item.id}</Typography>

              {item.trade_count > 0 ? (
                <>
                  <Typography variant="body1" color={item.pnl_ratio >= 0 ? green[700] : red[700]}>
                    PNL <NumericFormat value={item.pnl_ratio} displayType="text" thousandSeparator suffix="%" />
                  </Typography>
                  <Typography variant="body2" color={item.pnl_ratio >= 0 ? green[700] : red[700]}>
                    Trade Count: {item.trade_count}
                  </Typography>
                </>
              ) : (
                <>
                  <Typography variant="body1" color={item.pnl_ratio >= 0 ? green[700] : red[700]}></Typography>
                  <Typography variant="body2" color={item.pnl_ratio >= 0 ? green[700] : red[700]}></Typography>
                </>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>
      {/* <Box mt={5}>
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
      </Box> */}
    </Box>
  );
};

export default ProfitCalendar;
