import User from '../models/user.model.js';
import Booking from '../models/booking.js';
import { errorHandler } from '../utils/error.js';
import bcryptjs from 'bcryptjs';

export const test = (req, res) => {
  res.json({
    message: 'API is working!',
  });
};

// Get user with their bookings
export const getUserWithBookings = async (req, res, next) => {
  try {
    // Verify that the user can only access their own data
    if (req.user.id !== req.params.id) {
      return next(errorHandler(401, 'You can only access your own bookings!'));
    }

    // Find user's bookings
    const bookings = await Booking.find({ userId: req.params.id })
      .populate('movieId', 'name genre duration rating')
      .populate('showtimeId', 'startTime endTime screen')
      .populate('seats')
      .populate('parkingSlots.slotId')
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    next(error);
  }
};

// update user

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, 'You can update only your account!'));
  }
  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          phone: req.body.phone,
          phoneVerified: req.body.phoneVerified,
          profilePicture: req.body.profilePicture,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};


// delete user


export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, 'You can delete only your account!'));
  }
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json('User has been deleted...');
  } catch (error) {
    next(error);
  }
};