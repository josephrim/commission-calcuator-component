import React from 'react';
import CommissionWidget from './CommissionWidget';
import { Container, Grid, Box } from '@mui/material';

const Dashboard: React.FC = () => {
  return (
    <Container maxWidth='lg'>
      <Box sx={{ py: 5 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={4}>
            <CommissionWidget />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard;
