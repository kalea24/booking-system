const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middleware/auth');

// Public routes (customer)
router.get('/available-dates', bookingController.getAvailableDates);
router.post('/', bookingController.createBooking);

// Protected routes (owner only)
router.get('/', authMiddleware, bookingController.getAllBookings);
router.get('/:id', authMiddleware, bookingController.getBookingById);
router.patch('/:id', authMiddleware, bookingController.updateBookingStatus);
router.delete('/:id', authMiddleware, bookingController.deleteBooking);
router.post('/block-date', authMiddleware, bookingController.toggleBlockDate);

module.exports = router;