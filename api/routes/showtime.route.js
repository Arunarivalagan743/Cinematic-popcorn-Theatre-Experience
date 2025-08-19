import express from 'express';
import {
  createShowtime,
  getAllShowtimes,
  getShowtimesByMovie,
  getShowtimeById,
  updateExistingShowtimes
} from '../controllers/showtime.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// Get all showtimes
router.get('/', getAllShowtimes);

// Get showtimes for a specific movie
router.get('/movie/:movieId', getShowtimesByMovie);

// Get a specific showtime
router.get('/:id', getShowtimeById);

// Create a new showtime (admin only)
router.post('/', verifyToken, createShowtime);

// Update existing showtimes with new varied timings
router.post('/update-timings', updateExistingShowtimes);

export default router;
