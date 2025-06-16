// waggo/src/pages/AddRide.jsx
import { useState } from 'react';
import {
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  Typography,
  Alert,
} from '@mui/material';
import { API_BASE } from '../config';
import Header from '../components/Header';


export default function AddRide() {
  const [driver, setDriver] = useState('');
  const [distance, setDistance] = useState('');
  const [date, setDate] = useState('');
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    const body = {
      driver,
      distance: parseFloat(distance),
      date: date + ' 00:00:00',
    };

    try {
      const res = await fetch(`${API_BASE}/add_ride`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const result = await res.json();
      if (res.ok) {
        setStatus({ type: 'success', message: 'Ride added successfully' });
        setDistance('');
        setDate('');
      } else {
        setStatus({ type: 'error', message: result.error || 'Failed to add ride' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Network error' });
    }
  };

  return (
    <>
    <Header />
    <Box sx={{ maxWidth: 500, margin: 'auto', padding: '2rem' }}>
      {status && (
        <Alert severity={status.type} sx={{ mb: 3 }}>
          {status.message}
        </Alert>
      )}

      <Typography
        variant="h4"
        component="h1"
        align="center"
        gutterBottom
        sx={{
          fontFamily: 'Roboto, sans-serif',
          color: '#2c3e50',
          fontWeight: 500,
          borderBottom: '2px solid #ccc',
          paddingBottom: '0.5rem',
        }}
      >
        Add Ride
      </Typography>

      <form onSubmit={handleSubmit}>
        <Box mb={2}>
          <TextField
            label="Driver"
            select
            fullWidth
            value={driver}
            onChange={(e) => setDriver(e.target.value)}
            required
          >
            <MenuItem value="" disabled>
              Select a driver
            </MenuItem>
            <MenuItem value="Anne">Anne</MenuItem>
            <MenuItem value="Bram">Bram</MenuItem>
          </TextField>
        </Box>

        <Box mb={2}>
          <TextField
            label="Distance (km)"
            type="number"
            step="0.1"
            fullWidth
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            required
          />
        </Box>

        <Box mb={3}>
          <TextField
            label="Date"
            type="date"
            fullWidth
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            required
          />
        </Box>

        <Box mt={2} mb={2}>
          <Button variant="contained" type="submit" fullWidth>
            Submit
          </Button>
        </Box>
      </form>
    </Box>
    </>
  );
}
