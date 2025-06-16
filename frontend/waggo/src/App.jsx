import { Link } from 'react-router-dom';
import { Typography, Button, Box, Stack, Paper } from '@mui/material';

export default function App() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: 4,
      }}
    >
      <Paper elevation={3} sx={{ padding: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Waggo
        </Typography>
        <Stack spacing={2}>
          <Button variant="contained" component={Link} to="/add-ride">
            Add Ride
          </Button>
          <Button variant="contained" component={Link} to="/add-expense">
            Add Expense
          </Button>
          <Button variant="contained" component={Link} to="/unexported">
            Show Unexported
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
