import User from '../models/user.model.js';
import Booking from '../models/booking.js';
import { errorHandler } from '../utils/error.js';
import bcryptjs from 'bcryptjs';
import cloudinary from '../config/cloudinary.js';

export const test = (req, res) => {
  res.json({
    message: 'API is working!',
  });
};

// Debug endpoint to check users
export const debugUsers = async (req, res, next) => {
  try {
    const users = await User.find({}, 'username email role isActive');
    res.json({ users, count: users.length });
  } catch (error) {
    next(error);
  }
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

// Upload profile picture to Cloudinary
export const uploadProfilePicture = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(errorHandler(400, 'No image file provided'));
    }

    console.log('📸 Uploading profile picture for user:', req.user.id);
    console.log('📁 File info:', {
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype
    });

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'cinematic_profile_pictures',
      public_id: `user_${req.user.id}_${Date.now()}`,
      transformation: [
        { width: 300, height: 300, crop: 'fill' }, // Square crop for profile picture
        { quality: 'auto', fetch_format: 'auto' } // Optimize quality and format
      ]
    });

    console.log('✅ Cloudinary upload successful:', result.secure_url);

    // Update user's profile picture in database
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { 
        $set: { 
          profilePicture: result.secure_url 
        } 
      },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return next(errorHandler(404, 'User not found'));
    }

    res.status(200).json({
      success: true,
      message: 'Profile picture uploaded successfully',
      profilePicture: result.secure_url,
      user: updatedUser
    });

  } catch (error) {
    console.error('❌ Profile picture upload error:', error);
    next(errorHandler(500, 'Failed to upload profile picture: ' + error.message));
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
    // Check if user exists
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(errorHandler(404, 'User not found'));
    }
    
    // Delete user's bookings first (cleanup related data)
    await Booking.deleteMany({ userId: req.params.id });
    
    // Delete the user
    await User.findByIdAndDelete(req.params.id);
    
    // Clear the authentication cookie
    res.clearCookie('access_token');
    
    res.status(200).json({ 
      success: true, 
      message: 'User account and all related data have been deleted successfully' 
    });
  } catch (error) {
    console.error('Delete user error:', error);
    next(error);
  }
};