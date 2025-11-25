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

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // ✅ Send email to backend
      await api.post('/auth/send-otp', { email });
      setStep('otp'); // Move to OTP step
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // ✅ Send email + OTP to backend
      const response = await api.post('/auth/verify-otp', { email, otp });
      const { token } = response.data;

      localStorage.setItem('ownerToken', token);
      onLoginSuccess();
      navigate('/owner');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Owner Login</h2>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

      {step === 'email' ? (
        // ✅ EMAIL STEP
        <form onSubmit={handleSendOTP}>
          <div className="mb-4">
            <label className="block mb-2 text-gray-700">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="owner@business.com"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium transition"
          >
            {loading ? 'Sending OTP...' : 'Send OTP to Email'}
          </button>
        </form>
      ) : (
        // ✅ OTP VERIFICATION STEP
        <form onSubmit={handleVerifyOTP}>
          <div className="mb-4">
            <label className="block mb-2 text-gray-700">
              Enter OTP sent to <span className="font-medium text-blue-600">{email}</span>
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="123456"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep('email')}
              className="flex-1 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium transition"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </div>
        </form>
      )}

      {/* 💡 Helpful note for users */}
      <div className="mt-6 text-sm text-gray-600 text-center">
        <p>OTP is valid for 10 minutes.</p>
        <p className="mt-1">Check your spam folder if you don't see the email.</p>
      </div>
    </div>
  );
}