import { useState } from 'react'
import { API_BASE } from '../config'
import {
  Box,
  TextField,
  Button,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material'
import Header from '../components/Header';

export default function AddExpense() {
  const [payer, setPayer] = useState('')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [status, setStatus] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus(null)

    const body = {
      payer,
      amount: parseFloat(amount),
      description,
      date: date,
    }

    try {
      const res = await fetch(`${API_BASE}/add_expense`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const result = await res.json()
      if (res.ok) {
        setStatus('success')
        setAmount('')
        setDescription('')
        setDate('')
      } else {
        setStatus(result.error || 'error')
      }
    } catch (err) {
      setStatus('error')
    }
  }

  return (
    <>
    <Header />
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ maxWidth: 600, mx: 'auto', mt: 6, p: 4, bgcolor: 'background.paper', boxShadow: 3, borderRadius: 2 }}
    >
      <h1 style={{
        textAlign: 'center',
        marginBottom: '2rem',
        color: '#2c3e50',
        fontSize: '2.2rem',
        fontWeight: 500,
        fontFamily: 'Roboto, sans-serif',
        borderBottom: '2px solid #ccc',
        paddingBottom: '0.5rem'
      }}>
        Add Expense
      </h1>

      {status === 'success' && <Alert severity="success" sx={{ mb: 2 }}>Expense added successfully!</Alert>}
      {status && status !== 'success' && <Alert severity="error" sx={{ mb: 2 }}>{status}</Alert>}

      <FormControl fullWidth required sx={{ mb: 2 }}>
        <InputLabel>Payer</InputLabel>
        <Select
          value={payer}
          label="Payer"
          onChange={(e) => setPayer(e.target.value)}
        >
          <MenuItem value="" disabled>
            Select a payer
          </MenuItem>
          <MenuItem value="Anne">Anne</MenuItem>
          <MenuItem value="Bram">Bram</MenuItem>
        </Select>
      </FormControl>

      <TextField
        fullWidth
        label="Amount (€)"
        type="number"
        inputProps={{ step: '0.01' }}
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Box mt={2} mb={3}>
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

      <Box mt={2}>
        <Button variant="contained" type="submit" fullWidth>
          Submit
        </Button>
      </Box>

    </Box>
    </>
  )
}
