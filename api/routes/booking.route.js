import express from 'express';
import Booking from '../models/booking.model.js'; // Import the Booking model

const router = express.Router();

// POST route for creating a booking
router.post('/', async (req, res) => {
    try {
      const { movie, screen, timing, seats, totalCost, email, parkingDetails } = req.body;
      
      // Ensure all required fields are passed
      if (!movie || !screen || !timing || !seats || !totalCost || !email) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
      }
  
      const newBooking = new Booking({
        movie,
        screen,
        timing,
        seats,
        totalCost,
        email,
        parkingDetails,
      });
  
      await newBooking.save();
  
      res.status(201).json({
        success: true,
        message: 'Booking successful!',
        booking: newBooking,
      });
    } catch (error) {
      console.error('Error creating booking:', error); // Log the full error message
      res.status(500).json({
        success: false,
        message: 'Failed to create booking.',
      });
    }
  });
  

export default router;
