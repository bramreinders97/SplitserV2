import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { API_BASE } from '../config';
import Header from '../components/Header';

export default function UnexportedData() {
  const [rides, setRides] = useState([]);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/all_rides`)
      .then((res) => res.json())
      .then((data) => setRides(data.filter((r) => r.exported === '0')));

    fetch(`${API_BASE}/all_expenses`)
      .then((res) => res.json())
      .then((data) => setExpenses(data.filter((e) => e.exported === '0')));
  }, []);

  const totalKm = rides.reduce(
    (acc, ride) => {
      acc[ride.driver] = (acc[ride.driver] || 0) + parseFloat(ride.distance);
      return acc;
    },
    { Anne: 0, Bram: 0 }
  );

  const totalExpenses = expenses.reduce(
    (acc, exp) => {
      acc[exp.payer] = (acc[exp.payer] || 0) + parseFloat(exp.amount);
      return acc;
    },
    { Anne: 0, Bram: 0 }
  );

  return (
    <>
      <Header />
      <Box sx={{ padding: '2rem' }}>
        <Typography variant="h4" gutterBottom>
          Unexported Rides
        </Typography>
        <Paper sx={{ mb: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Driver</TableCell>
                <TableCell>Distance (km)</TableCell>
                <TableCell>Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rides.map((ride) => (
                <TableRow key={ride.id}>
                  <TableCell>{ride.date}</TableCell>
                  <TableCell>{ride.driver}</TableCell>
                  <TableCell>{ride.distance}</TableCell>
                  <TableCell>{ride.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
        <Typography variant="h6" sx={{ mb: 4 }}>
          Total KM — Anne: {totalKm.Anne.toFixed(1)} km, Bram: {totalKm.Bram.toFixed(1)} km
        </Typography>

        <Typography variant="h4" gutterBottom>
          Unexported Expenses
        </Typography>
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Payer</TableCell>
                <TableCell>Amount (€)</TableCell>
                <TableCell>Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {expenses.map((exp) => (
                <TableRow key={exp.id}>
                  <TableCell>{exp.date}</TableCell>
                  <TableCell>{exp.payer}</TableCell>
                  <TableCell>{parseFloat(exp.amount).toFixed(2)}</TableCell>
                  <TableCell>{exp.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
        <Typography variant="h6" sx={{ mt: 4 }}>
          Total Expenses — Anne: €{totalExpenses.Anne.toFixed(2)}, Bram: €{totalExpenses.Bram.toFixed(2)}
        </Typography>
      </Box>
    </>
  );
}
