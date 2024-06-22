import { Container, Stack } from '@mui/material';

const DemoStrategies = () => {
  return (
    <div>
      <Container id="demo-strategy" sx={{ py: { xs: 8, sm: 16 } }}>
        <Stack spacing={2}>1</Stack>
        <Stack spacing={2}>1</Stack>
        <Stack spacing={2}>1</Stack>
      </Container>
    </div>
  );
};

export default DemoStrategies;
