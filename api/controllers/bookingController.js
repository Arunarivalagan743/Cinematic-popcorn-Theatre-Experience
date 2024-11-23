// import Booking from '../models/booking.js';
// import email from '../models/user.model.js';  // If you're storing bookings linked to a user

// // Save booking
// export const createBooking = async (req, res) => {
//   const { movie, screen, timing, seats, totalCost, parkingDetails, userId } = req.body;

//   try {
//     const newBooking = new Booking({
//       movie,
//       screen,
//       timing,
//       seats,
//       totalCost,
//       parkingDetails: parkingDetails || null,  // Parking details can be null if not selected
//       email: email || null, // Optional: only if user authentication is implemented
//     });

//     const savedBooking = await newBooking.save();
//     res.status(201).json(savedBooking);
//   } catch (error) {
//     res.status(500).json({ message: 'Error creating booking', error });
//   }
// };

// // Get all bookings (for admin or user)
// export const getBookings = async (req, res) => {
//   try {
//     const bookings = await Booking.find().populate('user');
//     res.status(200).json(bookings);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching bookings', error });
//   }
// };

// // Get booking details by ID
// export const getBookingById = async (req, res) => {
//   try {
//     const booking = await Booking.findById(req.params.id);
//     res.status(200).json(booking);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching booking details', error });
//   }
// };
import Booking from '../models/booking.js';
import User from '../models/user.model.js';  // Assuming User model contains user details including email

// Save booking
export const createBooking = async (req, res) => {
  const { movie, screen, timing, seats, totalCost, parkingDetails, userEmail } = req.body;

  try {
    const newBooking = new Booking({
      movie,
      screen,
      timing,
      seats,
      totalCost,
      parkingDetails: parkingDetails || null,
      userEmail: userEmail || null,  // Saving the email of the user (if logged in)
    });

    const savedBooking = await newBooking.save();
    res.status(201).json(savedBooking);
  } catch (error) {
    res.status(500).json({ message: 'Error creating booking', error });
  }
};

// Get all bookings (for admin or user)
export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('userEmail');  // You may want to populate the user's data
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error });
  }
};

// Get booking details by ID
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching booking details', error });
  }
};
