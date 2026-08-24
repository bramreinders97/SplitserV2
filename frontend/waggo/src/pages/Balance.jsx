import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Stack,
  LinearProgress,
  Divider,
} from '@mui/material';
import { API_BASE } from '../config';
import Header from '../components/Header';
import { computeBalance, PEOPLE } from '../utils/balance';

const euro = (value) => `€${value.toFixed(2)}`;
const km = (value) => `${value.toFixed(1)} km`;
const pct = (fraction) => `${(fraction * 100).toFixed(1)}%`;

function SettlementBanner({ settlement }) {
  const settled = settlement.amount === 0;
  return (
    <Paper
      sx={{
        p: 3,
        mb: 4,
        textAlign: 'center',
        bgcolor: settled ? 'success.light' : 'primary.light',
        color: settled ? 'success.contrastText' : 'primary.contrastText',
      }}
    >
      {settled ? (
        <Typography variant="h5">All settled up 🎉</Typography>
      ) : (
        <>
          <Typography variant="subtitle1">Balance</Typography>
          <Typography variant="h4">
            {settlement.from} owes {settlement.to} {euro(settlement.amount)}
          </Typography>
        </>
      )}
    </Paper>
  );
}

function PersonCard({ name, data }) {
  const net = data.net[name];
  const overpaid = net >= 0;
  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        {name}
      </Typography>

      <Stack spacing={2}>
        <Box>
          <Typography variant="body2" color="text.secondary">
            Distance driven
          </Typography>
          <Typography variant="h6">
            {km(data.km[name])}{' '}
            <Typography component="span" variant="body2" color="text.secondary">
              ({pct(data.kmShare[name])})
            </Typography>
          </Typography>
          <LinearProgress
            variant="determinate"
            value={data.kmShare[name] * 100}
            sx={{ mt: 0.5 }}
          />
        </Box>

        <Box>
          <Typography variant="body2" color="text.secondary">
            Paid
          </Typography>
          <Typography variant="h6">
            {euro(data.paid[name])}{' '}
            <Typography component="span" variant="body2" color="text.secondary">
              ({pct(data.paidShare[name])})
            </Typography>
          </Typography>
          <LinearProgress
            variant="determinate"
            color="secondary"
            value={data.paidShare[name] * 100}
            sx={{ mt: 0.5 }}
          />
        </Box>

        <Divider />

        <Box>
          <Typography variant="body2" color="text.secondary">
            Fair share
          </Typography>
          <Typography variant="body1">{euro(data.fairShare[name])}</Typography>
        </Box>

        <Box>
          <Typography variant="body2" color="text.secondary">
            Net
          </Typography>
          <Typography
            variant="h6"
            sx={{ color: overpaid ? 'success.main' : 'error.main' }}
          >
            {overpaid ? '+' : '−'}
            {euro(Math.abs(net))}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
}

export default function Balance() {
  const [rides, setRides] = useState([]);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/all_rides`)
      .then((res) => res.json())
      .then(setRides);

    fetch(`${API_BASE}/all_expenses`)
      .then((res) => res.json())
      .then(setExpenses);
  }, []);

  const data = computeBalance(rides, expenses);

  return (
    <>
      <Header />
      <Box sx={{ padding: '2rem', maxWidth: 900, mx: 'auto' }}>
        <Typography variant="h4" gutterBottom>
          Balance
        </Typography>

        <SettlementBanner settlement={data.settlement} />

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Expenses are shared in proportion to distance driven. Totals: {km(data.totalKm)},{' '}
          {euro(data.totalPaid)}.
        </Typography>

        <Grid container spacing={3}>
          {PEOPLE.map((name) => (
            <Grid item xs={12} sm={6} key={name}>
              <PersonCard name={name} data={data} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
}
