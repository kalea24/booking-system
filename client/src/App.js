import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import CustomerBooking from './pages/CustomerBooking';
import OwnerDashboard from './pages/OwnerDashboard';
import OwnerLogin from './pages/OwnerLogin';

function App() {
  const [isOwnerAuthenticated, setIsOwnerAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('ownerToken');
    setIsOwnerAuthenticated(!!token);
  }, []);

  const handleLoginSuccess = () => {
    setIsOwnerAuthenticated(true);
  };

  return (
    <Router>
      <div className="App">
        {/* Navigation */}
        <nav className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <Link to="/" className="text-2xl font-bold text-primary">
                🏠 Booking System
              </Link>
              <div className="space-x-4">
                <Link
                  to="/"
                  className="px-4 py-2 text-gray-700 hover:text-primary font-medium"
                >
                  Book Now
                </Link>
                <Link
                  to="/owner"
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 font-medium"
                >
                  Owner Portal
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<CustomerBooking />} />
          <Route
            path="/owner"
            element={
              isOwnerAuthenticated ? (
                <OwnerDashboard />
              ) : (
                <OwnerLogin onLoginSuccess={handleLoginSuccess} />
              )
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}
const express = require('express')
const app = express()
const port = process.env.PORT || 4000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

export default App;