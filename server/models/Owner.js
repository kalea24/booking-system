const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ownerSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true
  },
  otp: {
    code: String,
    expiresAt: Date
  },
  gcashNumber: {
    type: String,
    default: '09123456789'
  },
  gcashQR: {
    type: String, // URL to QR code image
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Owner', ownerSchema);