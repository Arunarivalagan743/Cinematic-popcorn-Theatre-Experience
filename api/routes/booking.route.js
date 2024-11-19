// api/routes/booking.route.js
// routes/booking.route.js
import express from 'express';
import { createBooking } from '../controllers/booking.controller.js';


const router = express.Router();

// Protect the route with authentication middleware
router.post('/test-booking', createBooking);

export default router;
