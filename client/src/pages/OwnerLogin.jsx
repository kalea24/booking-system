// client/src/pages/OwnerLogin.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function OwnerLogin({ onLoginSuccess }) {
  const [step, setStep] = useState('email'); // 'email' or 'otp'
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const sendOTP = async () => {
    setLoading(true);
    setError('');
    
    try {
      await api.post('/auth/send-otp', { email });
      setStep('otp');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await api.post('/auth/verify-otp', { email, otp });
      const { token } = response.data;
      
      localStorage.setItem('ownerToken', token);
      onLoginSuccess();
      navigate('/owner');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Owner Login</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {step === 'email' ? (
        <>
          <div className="mb-4">
            <label className="block mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="owner@business.com"
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button
            onClick={sendOTP}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </>
      ) : (
        <>
          <div className="mb-4">
            <label className="block mb-2">Enter OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="123456"
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setStep('email')}
              className="flex-1 py-2 border border-gray-300 rounded hover:bg-gray-100"
            >
              Back
            </button>
            <button
              onClick={verifyOTP}
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}