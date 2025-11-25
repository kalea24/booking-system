// server/models/Owner.js
const mongoose = require('mongoose');

const ownerSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  otp: {
    code: String,
    expiresAt: Date
  },
  gcashNumber: String
}, { timestamps: true });

module.exports = mongoose.model('Owner', ownerSchema);