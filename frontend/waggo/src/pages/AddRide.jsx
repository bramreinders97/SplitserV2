import { useState } from 'react'
import { API_BASE } from '../config'

export default function AddRide() {
  const [driver, setDriver] = useState('Anne')
  const [distance, setDistance] = useState('')
  const [date, setDate] = useState('')
  const [status, setStatus] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus(null)

    const body = {
      driver,
      distance: parseFloat(distance),
      date: date.replace('T', ' ') + ':00',
    }

    console.log('Submitting body:', body)

    try {
      const res = await fetch(`${API_BASE}/add_ride`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const result = await res.json()

      console.log('Response status:', res.status)
      console.log('Response JSON:', result)

      if (res.ok) {
        setStatus('Success')
        setDistance('')
        setDate('')
      } else {
        setStatus(result.error || 'Failed')
      }
    } catch (err) {
      console.error('Fetch error:', err)
      setStatus('Error')
    }
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Add Ride</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <label>
          Driver:
          <select value={driver} onChange={(e) => setDriver(e.target.value)}>
            <option value="Anne">Anne</option>
            <option value="Bram">Bram</option>
          </select>
        </label>
        <label>
          Distance (km):
          <input
            type="number"
            step="0.1"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            required
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
