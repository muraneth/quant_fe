import { getTokenInfo } from 'server/tokenlist';
import { useState, useEffect } from 'react';

import { Box, Grid, Typography, Stack, Tooltip } from '@mui/material';

import { formatBigNumber, numberToPercentage } from 'utils/common';

const BaseInfo = ({ title, value }) => {
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Typography sx={{ color: 'text.secondary', fontSize: 10 }}>{title}</Typography>

      <Typography sx={{ color: 'text.primary', fontSize: 13 }}>{value}</Typography>
    </Stack>
  );
};

const TokenInf = ({ symbol }) => {
  const [baseInfo, setBaseInfo] = useState({});

  useEffect(() => {
    getTokenInfo(symbol).then((data) => {
      setBaseInfo(data ? data : {});
    });
  }, [symbol]);

  return (
    // <Box sx={{ width: '100%' ,p:0 }}>
    <Grid container rowSpacing={4.5} columnSpacing={2.75} alignItems="center" sx={{ width: '100%', p: 0 }}>
      {/* Symbol takes 2 columns width */}
      <Grid item xs={8} sm={4} md={3} lg={1}>
        <Typography variant="h6">{symbol}</Typography>
      </Grid>

      {/* First row of info starts after symbol */}
      <Grid item xs={8} sm={4} md={3} lg={1}>
        <BaseInfo title={'MCP'} value={formatBigNumber(baseInfo.mcp)} />
      </Grid>
      <Grid item xs={8} sm={4} md={3} lg={1}>
        <BaseInfo title={'Holder'} value={formatBigNumber(baseInfo.holder)} />
      </Grid>
      {/* Rest of the grid items */}
      <Grid item xs={8} sm={4} md={3} lg={1}>
        <BaseInfo title={'PoolSize'} value={formatBigNumber(baseInfo.poolsize)} />
      </Grid>
      <Grid item xs={8} sm={4} md={3} lg={1}>
        <BaseInfo title={'Volume'} value={formatBigNumber(baseInfo.volumn)} />
      </Grid>
      <Grid item xs={8} sm={4} md={3} lg={1.5}>
        <BaseInfo title={'VolumeToMcp'} value={numberToPercentage(baseInfo.volumn_to_mcp)} />
      </Grid>
      <Grid item xs={8} sm={4} md={3} lg={1}>
        <BaseInfo title={'VolumeToPool'} value={numberToPercentage(baseInfo.volumn_to_poolsize)} />
      </Grid>
    </Grid>
    // </Box>
  );
};
export default TokenInf;

// import { getTokenInfo } from 'server/tokenlist';
// import { useState, useEffect } from 'react';
// import { Box, Grid, Typography, Stack, Tooltip } from '@mui/material';
// import { formatBigNumber, numberToPercentage } from 'utils/common';

// const BaseInfo = ({ title, value }) => {
//   return (
//     <Box sx={{ padding: '4px 0' }}> {/* Reduced padding */}
//       <Typography variant="body2">{title}</Typography>
//       <Typography variant="body2">{value}</Typography>
//     </Box>
//   );
// };

// const TokenInf = ({ symbol }) => {
//   const [baseInfo, setBaseInfo] = useState({});

//   useEffect(() => {
//     getTokenInfo(symbol).then((data) => {
//       setBaseInfo(data ? data : {});
//     });
//   }, [symbol]);

//   return (
//     <Grid container spacing={1} sx={{ maxHeight: '100px' }}    direction="row" justifyContent="flex-start"> {/* Set max height */}
//       <Grid item xs={1}>
//         <Typography variant="h7">{symbol}</Typography>
//       </Grid>

//       {/* First row of info starts after symbol */}
//       <Grid item xs={4}>
//         <Stack direction="row" spacing={2}>
//           {/* Add BaseInfo components here */}
//           <BaseInfo title="Market Cap" value={formatBigNumber(baseInfo.marketCap)} />
//           <BaseInfo title="Volume" value={formatBigNumber(baseInfo.volume)} />
//         </Stack>
//       </Grid>

//       {/* Additional info rows */}
//       <Grid item xs={4}>
//         <Stack direction="row" spacing={2}>
//           <BaseInfo title="Circulating Supply" value={formatBigNumber(baseInfo.circulatingSupply)} />
//           <BaseInfo title="Total Supply" value={formatBigNumber(baseInfo.totalSupply)} />
//         </Stack>
//       </Grid>
//     </Grid>
//   );
// };

// export default TokenInf;
