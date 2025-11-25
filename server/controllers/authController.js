// server/controllers/authController.js
const Owner = require('../models/Owner');
const jwt = require('jsonwebtoken');
const sgMail = require('@sendgrid/mail');

// ✅ Set SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Get allowed emails from .env
const ALLOWED_OWNER_EMAILS = process.env.ALLOWED_OWNER_EMAILS
  ? process.env.ALLOWED_OWNER_EMAILS.split(',').map(email => email.trim())
  : [];

// Generate random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP via SendGrid
exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    
    // ✅ Only allow pre-approved emails
    if (!ALLOWED_OWNER_EMAILS.includes(email)) {
      return res.status(403).json({ message: 'Unauthorized email address' });
    }
    
    // Check if owner exists or create new
    let owner = await Owner.findOne({ email });
    if (!owner) {
      owner = new Owner({ email });
    }
    
    // Generate and save OTP
    const otp = generateOTP();
    owner.otp = {
      code: otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    };
    await owner.save();
    
    // ✅ Send OTP via SendGrid
    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL, // Must be verified sender
      subject: 'Your Booking System OTP Code',
      text: `Your OTP code is: ${otp}\n\nThis code expires in 10 minutes.`,
      html: `<p>Your OTP code is: <strong>${otp}</strong></p><p>This code expires in 10 minutes.</p>`
    };
    
    await sgMail.send(msg);
    res.json({ message: 'OTP sent to your email' });
    
  } catch (error) {
    console.error('SendGrid error:', error.response?.body || error.message);
    res.status(500).json({ message: 'Failed to send OTP. Please try again.' });
  }
};

// Verify OTP (same as before)
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    const owner = await Owner.findOne({ email });
    if (!owner) {
      return res.status(404).json({ message: 'Owner not found' });
    }
    
    if (!owner.otp || owner.otp.code !== otp) {
      return res.status(401).json({ message: 'Invalid OTP' });
    }
    
    if (new Date() > owner.otp.expiresAt) {
      return res.status(401).json({ message: 'OTP expired' });
    }
    
    owner.otp = undefined;
    await owner.save();
    
    const token = jwt.sign(
      { ownerId: owner._id, email: owner.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      message: 'Login successful',
      token,
      owner: {
        id: owner._id,
        email: owner.email
      }
    });
    
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ message: 'Error verifying OTP' });
  }
};