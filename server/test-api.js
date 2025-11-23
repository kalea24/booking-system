const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testAPI() {
  console.log('🧪 Starting API Tests...\n');

  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing Health Check...');
    const health = await axios.get('http://localhost:5000/health');
    console.log('✅ Health Check:', health.data);

    // Test 2: Get Available Dates
    console.log('\n2️⃣ Testing Get Available Dates...');
    const dates = await axios.get(`${API_URL}/bookings/available-dates?month=12&year=2025`);
    console.log('✅ Available Dates:', dates.data);

    // Test 3: Create Booking
    console.log('\n3️⃣ Testing Create Booking...');
    const booking = await axios.post(`${API_URL}/bookings`, {
      startDate: new Date('2025-12-25'),
      endDate: new Date('2025-12-27'),
      fullName: 'Test User',
      address: '123 Test St',
      mobileNumber: '09123456789',
      numberOfGuests: 2,
      guestNames: ['Test User 1', 'Test User 2'],
      paymentMethod: 'GCash'
    });
    console.log('✅ Booking Created:', booking.data);

    // Test 4: Send OTP
    console.log('\n4️⃣ Testing Send OTP...');
    const otpResponse = await axios.post(`${API_URL}/auth/send-otp`, {
      phone: '+639123456789'
    });
    console.log('✅ OTP Sent:', otpResponse.data);

    console.log('\n✅ All tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testAPI();