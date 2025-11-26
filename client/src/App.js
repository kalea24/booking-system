// client/src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import CustomerBooking from './pages/CustomerBooking';
import OwnerDashboard from './pages/OwnerDashboard';
import OwnerLogin from './pages/OwnerLogin';

function App() {
  const [isOwnerAuthenticated, setIsOwnerAuthenticated] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // ✅ Added for mobile menu

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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <Link to="/" className="text-xl font-bold text-blue-600">
                🏠 JMRN Happy Home
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-4">
                <Link
                  to="/"
                  className="px-3 py-2 text-gray-700 hover:text-blue-600 font-medium"
                >
                  Book Now
                </Link>
                <Link
                  to="/owner"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
                >
                  Owner Portal
                </Link>
              </div>

              {/* Mobile menu button */}
              <button
                className="md:hidden text-gray-700"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
              <div className="md:hidden py-4 border-t">
                <div className="flex flex-col space-y-3">
                  <Link
                    to="/"
                    className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Book Now
                  </Link>
                  <Link
                    to="/owner"
                    className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-center transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Owner Portal
                  </Link>
                </div>
              </div>
            )}
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

export default App;