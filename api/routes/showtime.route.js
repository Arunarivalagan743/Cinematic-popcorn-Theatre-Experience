import express from 'express';
import {
  createShowtime,
  getAllShowtimes,
  getShowtimesByMovie,
  getShowtimeById,
  updateExistingShowtimes,
  generateTodayShowtimes,
  forceArchivePastShowtimes,
  generateNextDayShowtimes,
  updateShowtime,
  deleteShowtime
} from '../controllers/showtime.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// Get all showtimes
router.get('/', getAllShowtimes);

// Get showtimes for a specific movie
router.get('/movie/:movieId', getShowtimesByMovie);

// Get showtimes for a specific movie (alternative endpoint)
router.get('/by-movie/:movieId', getShowtimesByMovie);

// Get a specific showtime
router.get('/:id', getShowtimeById);

// Create a new showtime (admin only)
router.post('/', verifyToken, createShowtime);

// Update a showtime (admin only)
router.put('/:id', verifyToken, updateShowtime);

// Delete a showtime (admin only)
router.delete('/:id', verifyToken, deleteShowtime);

// Update existing showtimes with new varied timings
router.post('/update-timings', updateExistingShowtimes);

// Generate today's showtimes with future times
router.post('/generate-today', verifyToken, generateTodayShowtimes);

// Force archive all past showtimes (can be used as admin tool or for fixing data)
router.post('/force-archive', verifyToken, forceArchivePastShowtimes);

// Manually generate showtimes for tomorrow
router.post('/generate-next-day', verifyToken, async (req, res) => {
  try {
    const count = await generateNextDayShowtimes();
    res.status(200).json({
      message: `Successfully generated ${count} showtimes for tomorrow`,
      count
    });
  } catch (error) {
    console.error('Error generating next day showtimes:', error);
    res.status(500).json({ message: 'Error generating showtimes', error: error.message });
  }
});

export default router;
