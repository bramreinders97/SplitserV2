import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import AddRide from './pages/AddRide'
import AddExpense from './pages/AddExpense'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename="/waggo">
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/add-ride" element={<AddRide />} />
        <Route path="/add-expense" element={<AddExpense />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
