// waggo/src/components/Header.jsx
import { AppBar, Toolbar, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Waggo
        </Typography>
        <Button color="inherit" component={Link} to="/">
          Home
        </Button>
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
  );
}
