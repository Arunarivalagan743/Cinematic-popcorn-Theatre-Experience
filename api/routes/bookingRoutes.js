// import express from 'express';
// import { createBooking, getBookings, getBookingById } from '../controllers/bookingController.js';

// const router = express.Router();

// // Create a new booking
// router.post('/bookings', createBooking);

// // Get all bookings
// router.get('/bookings', getBookings);

// // Get booking by ID
// router.get('/bookings/:id', getBookingById);

// // Export the router
// export default router;
import express from 'express';
import { createBooking, getBookings, getBookingById } from '../controllers/bookingController.js';

const router = express.Router();

// Create a new booking
router.post('/bookings', createBooking);

// Get all bookings
router.get('/bookings', getBookings);

// Get booking by ID
router.get('/bookings/:id', getBookingById);

export default router;
