import express from 'express';
import {
  getDashboardStats,
  getAllUsers,
  updateUserRole,
  getUserBookings,
  getAllBookings,
  updateBookingStatus,
  getMoviesAdmin,
  createMovie,
  updateMovie,
  deleteMovie,
  getRevenueReport,
  getContactMessages,
  getFAQQuestions,
  validateAdminAccess
} from '../controllers/admin.controller.js';
import { verifyAdmin, verifyManager } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Validation
router.get('/validate', verifyManager, validateAdminAccess);

// Dashboard
router.get('/dashboard', verifyManager, getDashboardStats);

// User Management
router.get('/users', verifyManager, getAllUsers);
router.put('/users/:userId', verifyAdmin, updateUserRole);
router.get('/users/:userId/bookings', verifyManager, getUserBookings);

// Booking Management
router.get('/bookings', verifyManager, getAllBookings);
router.put('/bookings/:bookingId', verifyManager, updateBookingStatus);

// Movie Management
router.get('/movies', verifyManager, getMoviesAdmin);
router.post('/movies', verifyAdmin, createMovie);
router.put('/movies/:movieId', verifyAdmin, updateMovie);
router.delete('/movies/:movieId', verifyAdmin, deleteMovie);

// Reports
router.get('/reports/revenue', verifyManager, getRevenueReport);

// Contact & FAQ Management
router.get('/contact-messages', verifyManager, getContactMessages);
router.get('/faq-questions', verifyManager, getFAQQuestions);

export default router;
