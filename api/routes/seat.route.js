import express from 'express';
import {
  getSeatsByShowtime,
  holdSeats,
  releaseHeldSeats
} from '../controllers/seat.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// Get seats for a specific showtime
router.get('/showtime/:showtimeId', getSeatsByShowtime);

// Hold seats temporarily
router.post('/hold', verifyToken, holdSeats);

// Release held seats
router.post('/release', verifyToken, releaseHeldSeats);

export default router;
