
import express from 'express';
import {
  createBooking,
  getBookings,
  getBookingById,
  getUserBookings
} from '../controllers/bookingController.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// Create a new booking
router.post('/bookings', verifyToken, createBooking);

// Get all bookings (admin)
router.get('/bookings', verifyToken, getBookings);

// Get bookings for a specific user
router.get('/user/:userId', verifyToken, getUserBookings);

// Get booking by ID
router.get('/bookings/:id', verifyToken, getBookingById);

export default router;
