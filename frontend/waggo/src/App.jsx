import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

export default function App() {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Waggo
          </Typography>
          <Button color="inherit" component={Link} to="/add-ride">
            Add Ride
          </Button>
          <Button color="inherit" component={Link} to="/add-expense">
            Add Expense
          </Button>
          <Button color="inherit" component={Link} to="/unexported">
            Unexported
          </Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ mt: 4 }}>
        <Typography align="center" variant="h5">
          Select an option above.
        </Typography>
      </Box>
    </>
  );
}
