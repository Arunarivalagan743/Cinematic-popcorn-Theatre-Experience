import User from '../models/user.model.js';
import Movie from '../models/movie.model.js';
import Booking from '../models/booking.js';
import Showtime from '../models/showtime.model.js';
import Seat from '../models/seat.model.js';
import ParkingSlot from '../models/parking.model.js';
import ContactMessage from '../models/contactMessage.js';
import FAQQuestion from '../models/FAQQuestion.js';
import mongoose from 'mongoose';
import cloudinary from '../config/cloudinary.js';

// Validate admin access
export const validateAdminAccess = async (req, res) => {
  try {
    // req.user is set by the middleware
    const { password: hashedPassword, ...rest } = req.user._doc || req.user;
    res.status(200).json(rest);
  } catch (error) {
    res.status(500).json({ message: 'Error validating admin access' });
  }
};

// Dashboard Overview
export const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    
    // Get today's stats
    const todayStats = await Promise.all([
      // Today's bookings
      Booking.countDocuments({
        createdAt: { $gte: startOfDay, $lte: endOfDay },
        paymentStatus: { $in: ['confirmed', 'COMPLETED'] }
      }),
      // Today's revenue
      Booking.aggregate([
        {
          $match: {
            createdAt: { $gte: startOfDay, $lte: endOfDay },
            paymentStatus: { $in: ['confirmed', 'COMPLETED'] }
          }
        },
        { $group: { _id: null, total: { $sum: '$totalCost' } } }
      ]),
      // Today's showtimes
      Showtime.countDocuments({
        date: { $gte: startOfDay, $lte: endOfDay },
        isArchived: false
      }),
      // Active users today
      User.countDocuments({
        lastLogin: { $gte: startOfDay, $lte: endOfDay }
      })
    ]);

    // Get overall stats
    const overallStats = await Promise.all([
      User.countDocuments({ isActive: true }),
      Movie.countDocuments(),
      Booking.countDocuments(),
      Showtime.countDocuments({ isArchived: false })
    ]);

    // Get recent bookings
    const recentBookings = await Booking.find({ paymentStatus: { $in: ['confirmed', 'COMPLETED'] } })
      .populate('movieId', 'name imageUrl')
      .populate('userId', 'username email')
      .populate('showtimeId')
      .sort({ createdAt: -1 })
      .limit(10);

    // Get seat occupancy for today's shows
    const todayShowtimes = await Showtime.find({
      date: { $gte: startOfDay, $lte: endOfDay },
      isArchived: false
    }).populate('movieId', 'name');

    const seatOccupancy = await Promise.all(
      todayShowtimes.map(async (showtime) => {
        const totalSeats = await Seat.countDocuments({ showtimeId: showtime._id });
        const bookedSeats = await Seat.countDocuments({ 
          showtimeId: showtime._id, 
          status: 'SOLD' 
        });
        
        return {
          showtimeId: showtime._id,
          movieName: showtime.movieId?.name,
          screen: showtime.screen,
          startTime: showtime.startTime,
          totalSeats,
          bookedSeats,
          occupancyRate: totalSeats > 0 ? (bookedSeats / totalSeats * 100).toFixed(1) : 0
        };
      })
    );

    // Get parking occupancy
    const parkingOccupancy = await Promise.all(
      todayShowtimes.map(async (showtime) => {
        const totalParking = await ParkingSlot.countDocuments({ showtimeId: showtime._id });
        const bookedParking = await ParkingSlot.countDocuments({ 
          showtimeId: showtime._id, 
          status: 'SOLD' 
        });
        
        return {
          showtimeId: showtime._id,
          movieName: showtime.movieId?.name,
          screen: showtime.screen,
          totalParking,
          bookedParking,
          occupancyRate: totalParking > 0 ? (bookedParking / totalParking * 100).toFixed(1) : 0
        };
      })
    );

    res.status(200).json({
      todayStats: {
        bookings: todayStats[0],
        revenue: todayStats[1][0]?.total || 0,
        showtimes: todayStats[2],
        activeUsers: todayStats[3]
      },
      overallStats: {
        totalUsers: overallStats[0],
        totalMovies: overallStats[1],
        totalBookings: overallStats[2],
        totalShowtimes: overallStats[3]
      },
      recentBookings,
      seatOccupancy,
      parkingOccupancy
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Error fetching dashboard stats', error: error.message });
  }
};

// User Management
export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, isActive, search } = req.query;
    
    console.log('getAllUsers - Raw query params:', req.query);
    console.log('getAllUsers - Parsed params:', { page, limit, role, isActive, search });
    
    const query = {};
    
    // Role filter
    if (role && role !== 'all') {
      query.role = role;
    }
    
    // Active status filter - be more careful with conversion
    if (isActive !== undefined && isActive !== 'all') {
      if (isActive === 'true' || isActive === true) {
        query.isActive = true;
      } else if (isActive === 'false' || isActive === false) {
        query.isActive = false;
      }
    }
    
    // Search filter
    if (search && search.trim() !== '') {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    console.log('getAllUsers - Final MongoDB query:', JSON.stringify(query, null, 2));

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await User.countDocuments(query);

    console.log(`getAllUsers - Found ${users.length} users, total in DB matching query: ${total}`);
    console.log('getAllUsers - First user sample:', users[0] ? { 
      id: users[0]._id, 
      username: users[0].username, 
      role: users[0].role, 
      isActive: users[0].isActive 
    } : 'No users found');

    res.status(200).json({
      users,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role, isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { role, isActive },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const bookings = await Booking.find({ userId })
      .populate('movieId', 'name imageUrl')
      .populate('showtimeId')
      .populate('seats')
      .populate('parkingSlots')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Booking.countDocuments({ userId });

    res.status(200).json({
      bookings,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ message: 'Error fetching user bookings', error: error.message });
  }
};

// Booking Management
export const getAllBookings = async (req, res) => {
  try {
    const { page = 1, limit = 10, paymentStatus, movieId, date } = req.query;
    
    const query = {};
    if (paymentStatus && paymentStatus !== 'all') query.paymentStatus = paymentStatus;
    if (movieId && movieId !== 'all') query.movieId = movieId;
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.createdAt = { $gte: startDate, $lt: endDate };
    }

    const bookings = await Booking.find(query)
      .populate('movieId', 'name imageUrl duration genre')
      .populate('userId', 'username email phone')
      .populate('showtimeId')
      .populate('seats')
      .populate('parkingSlots')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Booking.countDocuments(query);

    res.status(200).json({
      bookings,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { paymentStatus, action } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (action === 'cancel') {
      // Release seats and parking slots
      await Seat.updateMany(
        { _id: { $in: booking.seats } },
        { status: 'AVAILABLE', userId: null }
      );
      
      if (booking.parkingSlots && booking.parkingSlots.length > 0) {
        await ParkingSlot.updateMany(
          { _id: { $in: booking.parkingSlots } },
          { status: 'AVAILABLE', userId: null, vehicleNumber: null }
        );
      }

      booking.paymentStatus = 'cancelled';
    } else if (paymentStatus) {
      booking.paymentStatus = paymentStatus;
    }

    await booking.save();

    const updatedBooking = await Booking.findById(bookingId)
      .populate('movieId', 'name imageUrl')
      .populate('userId', 'username email')
      .populate('showtimeId')
      .populate('seats')
      .populate('parkingSlots');

    res.status(200).json({ 
      message: 'Booking updated successfully', 
      booking: updatedBooking 
    });
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ message: 'Error updating booking', error: error.message });
  }
};

// Movie Management
export const getMoviesAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { genre: { $regex: search, $options: 'i' } },
        { language: { $regex: search, $options: 'i' } }
      ];
    }

    const movies = await Movie.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Movie.countDocuments(query);

    // Get showtime count for each movie
    const moviesWithStats = await Promise.all(
      movies.map(async (movie) => {
        const showtimeCount = await Showtime.countDocuments({ 
          movieId: movie._id, 
          isArchived: false 
        });
        const bookingCount = await Booking.countDocuments({ movieId: movie._id });
        
        return {
          ...movie.toObject(),
          showtimeCount,
          bookingCount
        };
      })
    );

    res.status(200).json({
      movies: moviesWithStats,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({ message: 'Error fetching movies', error: error.message });
  }
};

export const createMovie = async (req, res) => {
  try {
    const movieData = req.body;
    const newMovie = new Movie(movieData);
    const savedMovie = await newMovie.save();
    
    res.status(201).json({ 
      message: 'Movie created successfully', 
      movie: savedMovie 
    });
  } catch (error) {
    console.error('Error creating movie:', error);
    res.status(500).json({ message: 'Error creating movie', error: error.message });
  }
};

export const updateMovie = async (req, res) => {
  try {
    const { movieId } = req.params;
    const updateData = req.body;

    const movie = await Movie.findByIdAndUpdate(movieId, updateData, { new: true });
    
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.status(200).json({ 
      message: 'Movie updated successfully', 
      movie 
    });
  } catch (error) {
    console.error('Error updating movie:', error);
    res.status(500).json({ message: 'Error updating movie', error: error.message });
  }
};

export const deleteMovie = async (req, res) => {
  try {
    const { movieId } = req.params;

    // Check if movie has active showtimes
    const activeShowtimes = await Showtime.countDocuments({ 
      movieId, 
      isArchived: false,
      startTime: { $gte: new Date() }
    });

    if (activeShowtimes > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete movie with active showtimes. Please archive or remove showtimes first.' 
      });
    }

    await Movie.findByIdAndDelete(movieId);
    
    res.status(200).json({ 
      message: 'Movie deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting movie:', error);
    res.status(500).json({ message: 'Error deleting movie', error: error.message });
  }
};

// Upload movie image to Cloudinary
export const uploadMovieImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    // The file has been uploaded to Cloudinary via multer middleware
    // req.file contains the Cloudinary response
    const imageUrl = req.file.path;
    const publicId = req.file.filename;

    res.status(200).json({
      message: 'Image uploaded successfully',
      imageUrl: imageUrl,
      publicId: publicId
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ 
      message: 'Error uploading image', 
      error: error.message 
    });
  }
};

// Reports
export const getRevenueReport = async (req, res) => {
  try {
    const { startDate, endDate, groupBy = 'day' } = req.query;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    let groupFormat;
    switch (groupBy) {
      case 'month':
        groupFormat = '%Y-%m';
        break;
      case 'week':
        groupFormat = '%Y-%U';
        break;
      default:
        groupFormat = '%Y-%m-%d';
    }

    const revenueData = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          paymentStatus: { $in: ['confirmed', 'COMPLETED'] }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: groupFormat, date: '$createdAt' } },
          totalRevenue: { $sum: '$totalCost' },
          bookingCount: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Get movie-wise revenue
    const movieRevenue = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          paymentStatus: { $in: ['confirmed', 'COMPLETED'] }
        }
      },
      {
        $lookup: {
          from: 'movies',
          localField: 'movieId',
          foreignField: '_id',
          as: 'movie'
        }
      },
      {
        $group: {
          _id: '$movieId',
          movieName: { $first: { $arrayElemAt: ['$movie.name', 0] } },
          totalRevenue: { $sum: '$totalCost' },
          bookingCount: { $sum: 1 }
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);

    res.status(200).json({
      revenueData,
      movieRevenue,
      period: { startDate, endDate, groupBy }
    });
  } catch (error) {
    console.error('Error generating revenue report:', error);
    res.status(500).json({ message: 'Error generating revenue report', error: error.message });
  }
};

// Contact Messages & FAQ Management
export const getContactMessages = async (req, res) => {
  try {
    const { page = 1, limit = 10, responded } = req.query;
    
    const query = {};
    if (responded !== undefined) query.responded = responded === 'true';

    const messages = await ContactMessage.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await ContactMessage.countDocuments(query);

    res.status(200).json({
      messages,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    res.status(500).json({ message: 'Error fetching contact messages', error: error.message });
  }
};

export const getFAQQuestions = async (req, res) => {
  try {
    const { page = 1, limit = 10, answered } = req.query;
    
    const query = {};
    if (answered !== undefined) query.answered = answered === 'true';

    const questions = await FAQQuestion.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await FAQQuestion.countDocuments(query);

    res.status(200).json({
      questions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching FAQ questions:', error);
    res.status(500).json({ message: 'Error fetching FAQ questions', error: error.message });
  }
};
