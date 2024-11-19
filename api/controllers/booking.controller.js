// controllers/booking.controller.js

// controllers/booking.controller.js
import Booking from '../models/booking.model.js';

export const createBooking = async (req, res) => {
  try {
    // Create a new booking document based on the request body
    const booking = new Booking(req.body);
    
    // Save the booking to the database
    await booking.save();
    
    // Return the created booking data
    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    // Handle any errors that might occur
    res.status(500).json({ success: false, message: error.message });
  }
};
