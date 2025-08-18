import express from 'express';
import Seat from '../models/seat.model.js';
import Showtime from '../models/showtime.model.js';

const router = express.Router();

// Generate 150 seats for a specific showtime
export const generateSeatsForShowtime = async (req, res) => {
  try {
    const { showtimeId } = req.params;
    
    // Check if showtime exists
    const showtime = await Showtime.findById(showtimeId);
    if (!showtime) {
      return res.status(404).json({ message: 'Showtime not found' });
    }
    
    // Check if seats already exist
    const existingSeats = await Seat.countDocuments({ showtimeId });
    if (existingSeats > 0) {
      return res.status(400).json({ 
        message: `Showtime already has ${existingSeats} seats`,
        existingSeats 
      });
    }
    
    // Generate 150 seats (15 rows x 10 seats = 150)
    const seats = [];
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O'];
    
    rows.forEach(row => {
      for (let seatNum = 1; seatNum <= 10; seatNum++) {
        seats.push({
          movieId: showtime.movieId,
          showtimeId,
          seatNumber: `${row}${seatNum}`,
          category: 'Silver',
          price: 150,
          status: 'AVAILABLE'
        });
      }
    });
    
    // Insert all seats
    const createdSeats = await Seat.insertMany(seats);
    
    res.status(201).json({
      message: `Successfully created 150 seats for showtime ${showtimeId}`,
      count: createdSeats.length,
      seats: createdSeats
    });
    
  } catch (error) {
    console.error('Error generating seats:', error);
    res.status(500).json({ 
      message: 'Error generating seats',
      error: error.message 
    });
  }
};

// Generate 150 seats for ALL showtimes
export const generateSeatsForAllShowtimes = async (req, res) => {
  try {
    const showtimes = await Showtime.find({});
    let totalCreated = 0;
    const results = [];
    
    for (const showtime of showtimes) {
      // Check if seats already exist
      const existingSeats = await Seat.countDocuments({ showtimeId: showtime._id });
      
      if (existingSeats > 0) {
        results.push({
          showtimeId: showtime._id,
          status: 'skipped',
          message: `Already has ${existingSeats} seats`,
          existingSeats
        });
        continue;
      }
      
      // Generate 150 seats
      const seats = [];
      const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O'];
      
      rows.forEach(row => {
        for (let seatNum = 1; seatNum <= 10; seatNum++) {
          seats.push({
            movieId: showtime.movieId,
            showtimeId: showtime._id,
            seatNumber: `${row}${seatNum}`,
            category: 'Silver',
            price: 150,
            status: 'AVAILABLE'
          });
        }
      });
      
      try {
        await Seat.insertMany(seats);
        totalCreated += 150;
        results.push({
          showtimeId: showtime._id,
          status: 'created',
          message: 'Successfully created 150 seats',
          count: 150
        });
      } catch (error) {
        results.push({
          showtimeId: showtime._id,
          status: 'error',
          message: error.message
        });
      }
    }
    
    res.status(200).json({
      message: `Seat generation completed`,
      totalShowtimes: showtimes.length,
      totalSeatsCreated: totalCreated,
      results
    });
    
  } catch (error) {
    console.error('Error generating seats for all showtimes:', error);
    res.status(500).json({ 
      message: 'Error generating seats for all showtimes',
      error: error.message 
    });
  }
};

// Get seat count for a showtime
export const getSeatCount = async (req, res) => {
  try {
    const { showtimeId } = req.params;
    const count = await Seat.countDocuments({ showtimeId });
    
    res.status(200).json({
      showtimeId,
      seatCount: count
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error getting seat count',
      error: error.message 
    });
  }
};

export default router;
