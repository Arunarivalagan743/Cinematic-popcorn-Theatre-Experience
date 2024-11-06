// const express = require('express');
// const Booking = require('../models/booking'); // Ensure this path is correct
// const { body, validationResult } = require('express-validator');

// const router = express.Router();

// // POST /api/checking
// router.post('/checking', [
//   body('movie').isString().withMessage('Movie is required and must be a string.'),
//   body('screen').isString().withMessage('Screen is required and must be a string.'),
//   body('timing').isString().withMessage('Timing is required and must be a string.'),
//   body('seats').isArray().withMessage('Seats must be an array of strings.'),
//   body('totalCost').isNumeric().withMessage('Total cost must be a number.'),
//   body('parkingDetails').optional().isObject().withMessage('Parking details must be an object.'),
// ], async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ success: false, errors: errors.array() });
//   }

//   const { movie, screen, timing, seats, totalCost, parkingDetails } = req.body;

//   try {
//     const booking = new Booking({
//       movie,
//       screen,
//       timing,
//       seats,
//       totalCost,
//       parkingDetails,
//     });

//     const savedBooking = await booking.save();
//     res.status(201).json({ success: true, message: 'Booking saved successfully', booking: savedBooking });
//   } catch (error) {
//     console.error('Error saving booking:', error);
//     res.status(500).json({ success: false, message: 'Failed to save booking', error: error.message });
//   }
// });

// module.exports = router;
