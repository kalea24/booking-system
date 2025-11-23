const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true
  },
  mobileNumber: {
    type: String,
    required: true,
    match: /^(\+63|0)[0-9]{10}$/
  },
  numberOfGuests: {
    type: Number,
    required: true,
    min: 1
  },
  guestNames: [{
    type: String,
    trim: true
  }],
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid via GCash', 'Cash on Arrival', 'Cancelled'],
    default: 'Pending'
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['GCash', 'Cash'],
    required: true
  },
  notes: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient date queries
bookingSchema.index({ startDate: 1, endDate: 1 });

module.exports = mongoose.model('Booking', bookingSchema);