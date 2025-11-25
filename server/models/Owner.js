// server/models/Owner.js
const mongoose = require('mongoose');

const ownerSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true }, // ✅ email, not phone
  otp: {
    code: String,
    expiresAt: Date
  }
}, { timestamps: true });

module.exports = mongoose.model('Owner', ownerSchema);