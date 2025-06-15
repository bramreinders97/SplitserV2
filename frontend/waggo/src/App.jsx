import { Link } from 'react-router-dom'

function App() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Waggo</h1>
      <nav style={{ marginTop: '1rem' }}>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '0.5rem' }}>
            <Link to="/add-ride">Add Ride</Link>
          </li>
          <li>
            <Link to="/add-expense">Add Expense</Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default App
