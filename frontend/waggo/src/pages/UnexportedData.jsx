import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel
} from '@mui/material';
import { API_BASE } from '../config';
import Header from '../components/Header';

function sortData(array, orderBy, order, isNumeric = false) {
  return [...array].sort((a, b) => {
    const valA = isNumeric ? parseFloat(a[orderBy]) : a[orderBy];
    const valB = isNumeric ? parseFloat(b[orderBy]) : b[orderBy];

    if (valA < valB) return order === 'asc' ? -1 : 1;
    if (valA > valB) return order === 'asc' ? 1 : -1;
    return 0;
  });
}

export default function UnexportedData() {
  const [rides, setRides] = useState([]);
  const [expenses, setExpenses] = useState([]);

  const [rideSort, setRideSort] = useState({ orderBy: 'date', order: 'asc' });
  const [expenseSort, setExpenseSort] = useState({ orderBy: 'date', order: 'asc' });

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

  const handleRideSort = (property) => {
    const isAsc = rideSort.orderBy === property && rideSort.order === 'asc';
    setRideSort({ orderBy: property, order: isAsc ? 'desc' : 'asc' });
  };

  const handleExpenseSort = (property) => {
    const isAsc = expenseSort.orderBy === property && expenseSort.order === 'asc';
    setExpenseSort({ orderBy: property, order: isAsc ? 'desc' : 'asc' });
  };

  const sortedRides = sortData(rides, rideSort.orderBy, rideSort.order, rideSort.orderBy === 'distance');
  const sortedExpenses = sortData(expenses, expenseSort.orderBy, expenseSort.order, expenseSort.orderBy === 'amount');

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
                {['date', 'driver', 'distance', 'description'].map((key) => (
                  <TableCell key={key}>
                    <TableSortLabel
                      active={rideSort.orderBy === key}
                      direction={rideSort.orderBy === key ? rideSort.order : 'asc'}
                      onClick={() => handleRideSort(key)}
                    >
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedRides.map((ride) => (
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
                {['date', 'payer', 'amount', 'description'].map((key) => (
                  <TableCell key={key}>
                    <TableSortLabel
                      active={expenseSort.orderBy === key}
                      direction={expenseSort.orderBy === key ? expenseSort.order : 'asc'}
                      onClick={() => handleExpenseSort(key)}
                    >
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedExpenses.map((exp) => (
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
