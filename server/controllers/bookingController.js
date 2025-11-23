const Booking = require('../models/Booking');
const BlockedDate = require('../models/BlockedDate');

// Get available dates for customer view
exports.getAvailableDates = async (req, res) => {
  try {
    const { month, year } = req.query;
    
    // Get all confirmed bookings for the month
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0);
    
    const bookings = await Booking.find({
      status: 'confirmed',
      $or: [
        { startDate: { $gte: startOfMonth, $lte: endOfMonth } },
        { endDate: { $gte: startOfMonth, $lte: endOfMonth } },
        { startDate: { $lte: startOfMonth }, endDate: { $gte: endOfMonth } }
      ]
    });
    
    // Get blocked dates
    const blockedDates = await BlockedDate.find({
      date: { $gte: startOfMonth, $lte: endOfMonth }
    });
    
    // Create array of unavailable dates
    const unavailableDates = [];
    
    // Add booking dates
    bookings.forEach(booking => {
      const current = new Date(booking.startDate);
      const end = new Date(booking.endDate);
      
      while (current <= end) {
        unavailableDates.push(new Date(current).toISOString().split('T')[0]); // ✅ Fixed
        current.setDate(current.getDate() + 1);
      }
    });
    
    // Add blocked dates
    blockedDates.forEach(blocked => {
      unavailableDates.push(new Date(blocked.date).toISOString().split('T')[0]); // ✅ Fixed
    });
    
    // Remove duplicates
    res.json({ unavailableDates: [...new Set(unavailableDates)] });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching available dates', error: error.message });
  }
};

// Create new booking (customer)
exports.createBooking = async (req, res) => {
  try {
    const {
      startDate,
      endDate,
      fullName,
      address,
      mobileNumber,
      numberOfGuests,
      guestNames,
      paymentMethod
    } = req.body;
    
    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start >= end) {
      return res.status(400).json({ message: 'End date must be after start date' });
    }
    
    // Check if dates are available
    const conflictingBooking = await Booking.findOne({
      status: 'confirmed',
      $or: [
        { startDate: { $lte: end }, endDate: { $gte: start } }
      ]
    });
    
    if (conflictingBooking) {
      return res.status(400).json({ message: 'Selected dates are not available' });
    }
    
    // Check blocked dates
    const blockedDate = await BlockedDate.findOne({
      date: { $gte: start, $lte: end }
    });
    
    if (blockedDate) {
      return res.status(400).json({ message: 'Selected dates are blocked' });
    }
    
    // Create booking
    const booking = new Booking({
      startDate: start,
      endDate: end,
      fullName,
      address,
      mobileNumber,
      numberOfGuests,
      guestNames,
      paymentMethod
    });
    
    await booking.save();
    
    // Get payment instructions
    const paymentInstructions = paymentMethod === 'GCash' 
      ? `Send payment to GCash number: ${process.env.GCASH_NUMBER}. Please screenshot your receipt and contact the owner.`
      : 'Please contact the owner to arrange cash payment.';
    
    res.status(201).json({
      message: 'Booking created successfully',
      booking: {
        id: booking._id,
        startDate: booking.startDate,
        endDate: booking.endDate,
        fullName: booking.fullName,
        numberOfGuests: booking.numberOfGuests
      },
      paymentInstructions
    });
    
  } catch (error) {
    res.status(500).json({ message: 'Error creating booking', error: error.message });
  }
};

// Get all bookings (owner only)
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json({ bookings });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
};

// Get single booking details (owner only)
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    res.json({ booking });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching booking', error: error.message });
  }
};

// Update booking status (owner only)
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status, paymentStatus, notes } = req.body;
    
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    if (status) booking.status = status;
    if (paymentStatus) booking.paymentStatus = paymentStatus;
    if (notes !== undefined) booking.notes = notes;
    
    await booking.save();
    
    res.json({ message: 'Booking updated successfully', booking });
  } catch (error) {
    res.status(500).json({ message: 'Error updating booking', error: error.message });
  }
};

// Delete booking (owner only)
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting booking', error: error.message });
  }
};

// Block/unblock dates (owner only)
exports.toggleBlockDate = async (req, res) => {
  try {
    const { date, reason } = req.body;
    
    const existingBlock = await BlockedDate.findOne({ date: new Date(date) });
    
    if (existingBlock) {
      // Unblock
      await BlockedDate.deleteOne({ _id: existingBlock._id });
      res.json({ message: 'Date unblocked successfully', blocked: false });
    } else {
      // Block
      const blockedDate = new BlockedDate({ date: new Date(date), reason });
      await blockedDate.save();
      res.json({ message: 'Date blocked successfully', blocked: true });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error toggling date block', error: error.message });
  }
};