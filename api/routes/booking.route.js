// api/routes/booking.route.js
// routes/booking.route.js

import express from 'express';
import { createBooking } from '../controllers/booking.controller.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Protect the route with authentication middleware
router.post('/test-booking', authMiddleware, createBooking);

export default router;
