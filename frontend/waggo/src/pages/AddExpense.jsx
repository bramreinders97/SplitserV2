// waggo/src/pages/AddExpense.jsx
import { useState } from 'react'
import { API_BASE } from '../config'

export default function AddExpense() {
  const [payer, setPayer] = useState('Anne')
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
      date: date.replace('T', ' ') + ':00',
    }

    try {
      const res = await fetch(`${API_BASE}/add_expense`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const result = await res.json()
      if (res.ok) {
        setStatus('Success')
        setAmount('')
        setDescription('')
        setDate('')
      } else {
        setStatus(result.error || 'Failed')
      }
    } catch (err) {
      setStatus('Error')
    }
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Add Expense</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <label>
          Payer:
          <select value={payer} onChange={(e) => setPayer(e.target.value)}>
            <option value="Anne">Anne</option>
            <option value="Bram">Bram</option>
          </select>
        </label>
        <label>
          Amount (€):
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </label>
        <label>
          Description:
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <label>
          Date:
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </label>
        <button type="submit">Submit</button>
      </form>
      {status && <p>{status}</p>}
    </div>
  )
}
