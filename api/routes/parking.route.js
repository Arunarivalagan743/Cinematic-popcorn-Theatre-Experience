import express from 'express';
import {
  getParkingSlotsByShowtime,
  holdParkingSlots,
  releaseHeldParkingSlots
} from '../controllers/parking.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// Get parking slots for a specific showtime
router.get('/showtime/:showtimeId', getParkingSlotsByShowtime);

// Hold parking slots temporarily
router.post('/hold', verifyToken, holdParkingSlots);

// Release held parking slots
router.post('/release', verifyToken, releaseHeldParkingSlots);

export default router;
