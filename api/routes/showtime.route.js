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
import { fixAndRegenerateShowtimes } from '../controllers/showtimeFix.controller.js';
import { emergencyGenerateShowtimes } from '../controllers/emergencyShowtime.controller.js';
import { verifyToken } from '../utils/verifyUser.js';
import Showtime from '../models/showtime.model.js';

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

// Fix and regenerate showtimes for today and tomorrow
router.post('/fix-and-regenerate', verifyToken, fixAndRegenerateShowtimes);

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

// Emergency fix endpoint (no auth required for testing)
router.post('/emergency-generate', async (req, res) => {
  try {
    await emergencyGenerateShowtimes(req, res);
  } catch (error) {
    console.error('Error in emergency generation route:', error);
    res.status(500).json({ message: 'Emergency route failed', error: error.message });
  }
});

// Quick fix endpoint (no auth required for testing)
router.post('/quick-fix', async (req, res) => {
  try {
    // First, let's see what we have
    const currentDate = new Date();
    
    // Get all showtimes to debug
    const allShowtimes = await Showtime.find({}).populate('movieId', 'name');
    
    // Archive all past showtimes
    const archiveResult = await Showtime.updateMany(
      { endTime: { $lt: currentDate } },
      { $set: { isArchived: true } }
    );
    
    // Delete showtimes that are way in the future (like 2026)
    const futureDeleteResult = await Showtime.deleteMany({
      startTime: { $gt: new Date('2025-12-31') }
    });
    
    // Generate new showtimes for today and tomorrow
    const todayCount = await generateTodayShowtimes();
    const tomorrowCount = await generateNextDayShowtimes();
    
    res.status(200).json({
      message: 'Quick fix completed',
      totalShowtimes: allShowtimes.length,
      archivedCount: archiveResult.modifiedCount,
      deletedFutureCount: futureDeleteResult.deletedCount,
      generatedToday: todayCount,
      generatedTomorrow: tomorrowCount,
      debug: {
        sampleShowtimes: allShowtimes.slice(0, 3).map(st => ({
          id: st._id,
          movie: st.movieId?.name,
          screen: st.screen,
          date: st.date,
          startTime: st.startTime,
          isArchived: st.isArchived
        }))
      }
    });
  } catch (error) {
    console.error('Error in quick fix:', error);
    res.status(500).json({ message: 'Error in quick fix', error: error.message });
  }
});

export default router;
