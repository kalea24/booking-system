const Owner = require('../models/Owner');
const jwt = require('jsonwebtoken');

// Generate random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP (simplified - in production use Twilio SMS)
exports.sendOTP = async (req, res) => {
  try {
    const { phone } = req.body;
    
    // Validate phone number
    if (!phone || !phone.match(/^(\+63|0)[0-9]{10}$/)) {
      return res.status(400).json({ message: 'Invalid phone number format' });
    }
    
    // Check if owner exists or create new
    let owner = await Owner.findOne({ phone });
    
    if (!owner) {
      owner = new Owner({ phone });
    }
    
    // Generate OTP
    const otp = generateOTP();
    owner.otp = {
      code: otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    };
    
    await owner.save();
    
    // In production, send via Twilio SMS
    console.log(`OTP for ${phone}: ${otp}`);
    
    // For development, return OTP (REMOVE IN PRODUCTION)
    res.json({ 
      message: 'OTP sent successfully',
      // Remove this in production:
      otp: process.env.NODE_ENV === 'development' ? otp : undefined
    });
    
  } catch (error) {
    res.status(500).json({ message: 'Error sending OTP', error: error.message });
  }
};

// Verify OTP and login
exports.verifyOTP = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    
    const owner = await Owner.findOne({ phone });
    
    if (!owner) {
      return res.status(404).json({ message: 'Owner not found' });
    }
    
    // Check OTP
    if (!owner.otp || owner.otp.code !== otp) {
      return res.status(401).json({ message: 'Invalid OTP' });
    }
    
    // Check expiration
    if (new Date() > owner.otp.expiresAt) {
      return res.status(401).json({ message: 'OTP expired' });
    }
    
    // Clear OTP
    owner.otp = undefined;
    await owner.save();
    
    // Generate JWT
    const token = jwt.sign(
      { ownerId: owner._id, phone: owner.phone },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      message: 'Login successful',
      token,
      owner: {
        id: owner._id,
        phone: owner.phone,
        gcashNumber: owner.gcashNumber
      }
    });
    
  } catch (error) {
    res.status(500).json({ message: 'Error verifying OTP', error: error.message });
  }
};