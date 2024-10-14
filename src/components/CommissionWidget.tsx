import React, { useState } from 'react';
import {
  TextField,
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Button,
} from '@mui/material';

import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend);

interface CommissionBand {
  lower: number;
  upper: number | null;
  rate: number;
}

const commissionBands: CommissionBand[] = [
  { lower: 0, upper: 5000, rate: 0 },
  { lower: 5000, upper: 10000, rate: 0.1 },
  { lower: 10000, upper: 15000, rate: 0.15 },
  { lower: 15000, upper: 20000, rate: 0.2 },
  { lower: 20000, upper: null, rate: 0.25 },
];

const calculateCommission = (revenue: number) => {
  let totalCommission = 0;
  const breakdown: { band: string; amount: number }[] = [];

  for (const band of commissionBands) {
    if (revenue > band.lower) {
      const upperLimit = band.upper ? Math.min(revenue, band.upper) : revenue;
      const applicableAmount = upperLimit - band.lower;
      const commission = applicableAmount * band.rate;
      totalCommission += commission;
      breakdown.push({
        band: `${band.lower} to ${band.upper || '∞'}`,
        amount: commission,
      });
    }
  }

  return { totalCommission, breakdown };
};

const CommissionWidget: React.FC = () => {
  const [revenue, setRevenue] = useState<number | string>(''); // Initialize as an empty string to prevent NaN
  const [commissionDetails, setCommissionDetails] = useState<{
    totalCommission: number;
    breakdown: { band: string; amount: number }[];
  } | null>(null);

  const handleRevenueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value =
      event.target.value === '' ? '' : parseFloat(event.target.value);
    setRevenue(value);
    if (value !== '') {
      setCommissionDetails(calculateCommission(value));
    } else {
      setCommissionDetails(null); // Reset if input is cleared
    }
  };

  const data = {
    labels: commissionDetails?.breakdown.map((item) => item.band) || [],
    datasets: [
      {
        label: 'Commission Breakdown',
        data: commissionDetails?.breakdown.map((item) => item.amount) || [],
        backgroundColor: [
          '#66bb6a',
          '#ffa726',
          '#42a5f5',
          '#ab47bc',
          '#ef5350',
        ],
        hoverBackgroundColor: [
          '#43a047',
          '#fb8c00',
          '#1e88e5',
          '#8e24aa',
          '#e53935',
        ],
      },
    ],
  };

  return (
    <Card
      variant='outlined'
      sx={{ maxWidth: 400, margin: 'auto', boxShadow: 1 }}
    >
      <CardContent>
        <Typography
          variant='h6'
          component='div'
          fontWeight={900}
          gutterBottom
          sx={{ display: 'flex', justifyContent: 'space-between' }}
        >
          Commission Calculator
          <Button
            variant='outlined'
            sx={{
              minWidth: 0,
              padding: 0.5,
              borderRadius: 2,
              borderColor: 'lightgray',
            }}
          >
            <DeleteOutlineIcon fontSize='small' sx={{ color: 'black' }} />
          </Button>
        </Typography>
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            label='Enter Revenue'
            type='number'
            variant='outlined'
            value={revenue} // Bind the value to `revenue`, ensuring it's a valid number or empty string
            onChange={handleRevenueChange}
          />
        </Box>
        {commissionDetails && (
          <>
            <Box sx={{ mb: 2 }}>
              <Typography variant='body1' gutterBottom>
                Total Commission: £
                {commissionDetails.totalCommission.toFixed(2)}
              </Typography>
              <CircularProgress
                variant='determinate'
                value={
                  (commissionDetails.totalCommission / Number(revenue)) * 100
                }
              />
            </Box>
            <Doughnut data={data} />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CommissionWidget;
