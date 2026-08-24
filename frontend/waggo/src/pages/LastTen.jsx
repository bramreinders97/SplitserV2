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

const NUMERIC_KEYS = ['id', 'distance', 'amount'];

function sortData(array, orderBy, order) {
  const isNumeric = NUMERIC_KEYS.includes(orderBy);
  return [...array].sort((a, b) => {
    const valA = isNumeric ? parseFloat(a[orderBy]) : a[orderBy];
    const valB = isNumeric ? parseFloat(b[orderBy]) : b[orderBy];

    if (valA < valB) return order === 'asc' ? -1 : 1;
    if (valA > valB) return order === 'asc' ? 1 : -1;
    return 0;
  });
}

function lastTenById(data) {
  return sortData(data, 'id', 'desc').slice(0, 10);
}

export default function LastTen() {
  const [rides, setRides] = useState([]);
  const [expenses, setExpenses] = useState([]);

  const [rideSort, setRideSort] = useState({ orderBy: 'date', order: 'asc' });
  const [expenseSort, setExpenseSort] = useState({ orderBy: 'date', order: 'asc' });

  useEffect(() => {
    fetch(`${API_BASE}/all_rides`)
      .then((res) => res.json())
      .then((data) => setRides(lastTenById(data)));

    fetch(`${API_BASE}/all_expenses`)
      .then((res) => res.json())
      .then((data) => setExpenses(lastTenById(data)));
  }, []);

  const handleRideSort = (property) => {
    const isAsc = rideSort.orderBy === property && rideSort.order === 'asc';
    setRideSort({ orderBy: property, order: isAsc ? 'desc' : 'asc' });
  };

  const handleExpenseSort = (property) => {
    const isAsc = expenseSort.orderBy === property && expenseSort.order === 'asc';
    setExpenseSort({ orderBy: property, order: isAsc ? 'desc' : 'asc' });
  };

  const sortedRides = sortData(rides, rideSort.orderBy, rideSort.order);
  const sortedExpenses = sortData(expenses, expenseSort.orderBy, expenseSort.order);

  return (
    <>
      <Header />
      <Box sx={{ padding: '2rem' }}>
        <Typography variant="h4" gutterBottom>
          Last 10 Rides
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

        <Typography variant="h4" gutterBottom>
          Last 10 Expenses
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
      </Box>
    </>
  );
}
