import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { visuallyHidden } from '@mui/utils';
import PnlRatioChart from 'pages/strategies/components/Pnl-Ratiao-Chart';
// import AcumPnlRatioAraeChart from 'pages/strategies/strategy-detail/Pnl-ratio-area';

export default function Hero() {
  return (
    <Box
      id="hero"
      sx={(theme) => ({
        width: '100%',
        backgroundImage:
          theme.palette.mode === 'light'
            ? 'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 90%), transparent)'
            : 'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 16%), transparent)',
        backgroundRepeat: 'no-repeat'
      })}
    >
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: { xs: 14, sm: 20 },
          pb: { xs: 8, sm: 12 }
        }}
      >
        <Stack spacing={2} alignItems="center" useFlexGap sx={{ width: { xs: '100%', sm: '70%' } }}>
          <Typography
            variant="h1"
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              fontSize: 'clamp(3rem, 10vw, 3.5rem)'
            }}
          >
            Add&nbsp;Value&nbsp;To&nbsp;Your&nbsp;
            <Typography
              component="span"
              variant="h1"
              sx={{
                fontSize: 'inherit',
                color: (theme) => (theme.palette.mode === 'light' ? 'primary.main' : 'primary.light')
              }}
            >
              Wealth
            </Typography>
          </Typography>
          <Typography textAlign="center" color="text.secondary" variant="h5" sx={{ width: { sm: '100%', md: '80%' } }}>
            Explore the best strategies to grow your wealth.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} useFlexGap sx={{ pt: 2, width: { xs: '100%', sm: 'auto' } }}>
            <Button
              variant="contained"
              href="/strategies/"
              size="large"
              sx={{
                bgcolor: 'secondary.main',
                color: 'white',

                '&:hover': {
                  bgcolor: 'secondary.light'
                }
              }}
            >
              Explore Strategy
            </Button>
          </Stack>
        </Stack>
        <Box
          id="image"
          sx={(theme) => ({
            mt: { xs: 8, sm: 10 },
            alignSelf: 'center',
            height: { xs: 200, sm: 300, md: 500, lg: 600 },
            width: '100%',
            // backgroundImage:
            //   theme.palette.mode === 'light'
            //     ? 'url("/static/images/templates/templates-images/hero-light.png")'
            //     : 'url("/static/images/templates/templates-images/hero-dark.png")',
            backgroundSize: 'cover',
            borderRadius: '12px',
            outline: '1px solid',
            outlineColor: theme.palette.mode === 'light' ? 'hsla(220, 25%, 80%, 0.5)' : 'hsla(210, 100%, 80%, 0.1)',
            boxShadow: theme.palette.mode === 'light' ? '0 0 12px 8px hsla(220, 25%, 80%, 0.2)' : '0 0 24px 12px hsla(210, 100%, 25%, 0.2)'
          })}
        >
          <PnlRatioChart slot="all" product="myquant01" showDetail={true} strokeWidth={1} showGrid={true} showBtc={true} />
        </Box>
      </Container>
    </Box>
  );
}
