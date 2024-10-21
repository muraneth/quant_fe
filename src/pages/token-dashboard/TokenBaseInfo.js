import { getTokenInfo } from 'server/tokenlist';
import { useState, useEffect } from 'react';

import { Box, Grid, Typography, Card, CardContent } from '@mui/material';

import { formatBigNumber, numberToPercentage } from 'utils/common';
const BaseCard = ({ title, value }) => {
  return (
    <Card sx={{ minWidth: 75 }}>
      <CardContent>
        <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
          {title}
        </Typography>
        <Typography variant="h5" component="div"></Typography>

        <Typography variant="body2">{value}</Typography>
      </CardContent>
    </Card>
  );
};
export default function TokenBaseInfo({ symbol }) {
  const [baseInfo, setBaseInfo] = useState({});

  useEffect(() => {
    getTokenInfo(symbol).then((data) => {
      setBaseInfo(data ? data : {});
    });
  }, [symbol]);

  return (
    <Box sx={{ width: '100%', ml: { xs: 1, md: 1 }, mt: 6 }}>
      <h1>{symbol} Base Info</h1>
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
        <Grid item xs={8} sm={4} md={3} lg={2}>
          <BaseCard title={'MarketCap'} value={formatBigNumber(baseInfo.mcp)} />
        </Grid>
        <Grid item xs={8} sm={4} md={3} lg={2}>
          <BaseCard title={'Holder'} value={baseInfo.holder} />
        </Grid>
        <Grid item xs={8} sm={4} md={3} lg={2}>
          <BaseCard title={'PoolSize'} value={formatBigNumber(baseInfo.poolsize)} />
        </Grid>
        <Grid item xs={8} sm={4} md={3} lg={2}>
          <BaseCard title={'Volume'} value={formatBigNumber(baseInfo.volumn)} />
        </Grid>
        <Grid item xs={8} sm={4} md={3} lg={2}>
          <BaseCard title={'VolumeToMcp'} value={numberToPercentage(baseInfo.volumn_to_mcp)} />
        </Grid>

        <Grid item xs={8} sm={4} md={3} lg={2}>
          <BaseCard title={'VolumeToPool'} value={numberToPercentage(baseInfo.volumn_to_poolsize)} />
        </Grid>
      </Grid>
    </Box>
  );
}
