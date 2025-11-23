const mongoose = require('mongoose');

const blockedDateSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true
  },
  reason: {
    type: String,
    default: 'Blocked by owner'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('BlockedDate', blockedDateSchema);