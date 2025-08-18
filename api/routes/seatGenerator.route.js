import express from 'express';
import { 
  generateSeatsForShowtime, 
  generateSeatsForAllShowtimes, 
  getSeatCount 
} from '../controllers/seatGenerator.controller.js';

const router = express.Router();

// Generate 150 seats for a specific showtime
router.post('/generate/:showtimeId', generateSeatsForShowtime);

// Generate 150 seats for ALL showtimes
router.post('/generate-all', generateSeatsForAllShowtimes);

// Get seat count for a showtime
router.get('/count/:showtimeId', getSeatCount);

export default router;
