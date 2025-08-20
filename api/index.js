
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cron from 'node-cron';

// Routes
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import movieRoutes from './routes/movie.route.js';
import bookingRoutes from './routes/bookingRoutes.js';
import confirmPaymentRoutes from './routes/confirmPaymentRoutes.js';
import contactRoutes from './routes/contact.js';
import faqRoutes from './routes/faq.js';
import showtimeRoutes from './routes/showtime.route.js';
import seatRoutes from './routes/seat.route.js';
import parkingRoutes from './routes/parking.route.js';
import seatGeneratorRoutes from './routes/seatGenerator.route.js';
import adminRoutes from './routes/admin.route.js';

// Models
import Showtime from './models/showtime.model.js';

// Controllers for scheduled tasks
import { archivePastShowtimes, generateNextDayShowtimes } from './controllers/showtime.controller.js';
import { releaseExpiredHolds } from './controllers/seat.controller.js';
import { releaseExpiredParkingHolds } from './controllers/parking.controller.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5000;
const jwtSecret = process.env.JWT_SECRET;

// Set up Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://cinemax-beta-ten.vercel.app',
      'https://www.cinexp.app',
      'https://cinematic-popcorn-theatre-experience.vercel.app',
      'https://cinematic-popcorn-park.vercel.app',
    ],
    credentials: true
  }
});

// Make io accessible to routes
app.set('io', io);

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  
  // Join a room for specific showtime updates
  socket.on('joinShowtime', (showtimeId) => {
    socket.join(`showtime-${showtimeId}`);
    console.log(`User ${socket.id} joined room for showtime ${showtimeId}`);
  });
  
  // Leave a room when no longer needed
  socket.on('leaveShowtime', (showtimeId) => {
    socket.leave(`showtime-${showtimeId}`);
    console.log(`User ${socket.id} left room for showtime ${showtimeId}`);
  });
  
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Middleware
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://cinemax-beta-ten.vercel.app',
  'https://www.cinexp.app',
  'https://cinematic-popcorn-theatre-experience.vercel.app',
  'https://cinematic-popcorn-park.vercel.app',
  // Add your actual frontend deployment URL here when you deploy
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // In development, allow all origins
    if (process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    
    // In production, check against allowed origins
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
// CORS Configuration to allow requests from your Netlify frontend

// Connect to MongoDB using Mongoose
mongoose
  .connect(process.env.MONGO)
  .then(() => console.log('Connected to MongoDB with Mongoose'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api', bookingRoutes);
app.use('/api', confirmPaymentRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/faq', faqRoutes);
app.use('/api/showtimes', showtimeRoutes);
app.use('/api/seats', seatRoutes);
app.use('/api/parking', parkingRoutes);
app.use('/api/seat-generator', seatGeneratorRoutes);
app.use('/api/admin', adminRoutes);

// Schedule jobs
// Release expired holds and check for past showtimes every minute
cron.schedule('* * * * *', async () => {
  try {
    // Import models here to avoid circular dependencies
    const Seat = mongoose.model('Seat');
    const ParkingSlot = mongoose.model('ParkingSlot');
    
    console.log(`Running minute scheduler at ${new Date().toISOString()}`);
    
    // First, archive past showtimes to ensure accurate booking status
    const archivedCount = await archivePastShowtimes();
    if (archivedCount > 0) {
      console.log(`Archived ${archivedCount} past showtimes during minute scheduler`);
      io.emit('showtimesUpdated', { message: 'Some showtimes have been archived' });
    }
    
    // Then release expired seat holds
    const releasedSeats = await releaseExpiredHolds();
    
    // Emit socket events for each affected showtime
    for (const [showtimeId, seatIds] of Object.entries(releasedSeats.seatsByShowtime || {})) {
      const updatedSeats = await Seat.find({ _id: { $in: seatIds } });
      io.to(`showtime-${showtimeId}`).emit('seatsUpdated', {
        seats: updatedSeats,
        showtimeId
      });
    }
    
    // Release expired parking holds
    const releasedParking = await releaseExpiredParkingHolds();
    
    // Emit socket events for each affected showtime
    for (const [showtimeId, slotIds] of Object.entries(releasedParking.slotsByShowtime || {})) {
      const updatedSlots = await ParkingSlot.find({ _id: { $in: slotIds } });
      io.to(`showtime-${showtimeId}`).emit('parkingUpdated', {
        parkingSlots: updatedSlots,
        showtimeId
      });
    }
  } catch (error) {
    console.error('Error in scheduled release of expired holds and showtime archiving:', error);
  }
});

// Archive past showtimes every minute to ensure timely updates
cron.schedule('* * * * *', async () => {
  try {
    console.log(`Running archiving cron job at ${new Date().toISOString()}`);
    const archivedCount = await archivePastShowtimes();
    
    if (archivedCount > 0) {
      console.log(`Cron job archived ${archivedCount} showtimes`);
      // Notify clients about archived showtimes if any were updated
      io.emit('showtimesUpdated', { 
        message: 'Some showtimes have been archived',
        count: archivedCount,
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Error in cron job archiving past showtimes:', error);
  }
});

// Check and generate next day's showtimes every 30 minutes
cron.schedule('*/30 * * * *', async () => {
  try {
    console.log('Checking if next day showtimes need to be generated...');
    // Get tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    // Check if we already have showtimes for tomorrow
    const tomorrowShowtimes = await Showtime.find({
      date: {
        $gte: tomorrow,
        $lt: new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000)
      }
    });
    
    if (tomorrowShowtimes.length === 0) {
      console.log('No showtimes found for tomorrow. Generating new showtimes...');
      const count = await generateNextDayShowtimes();
      console.log(`Generated ${count} showtimes for tomorrow.`);
    } else {
      console.log(`Already have ${tomorrowShowtimes.length} showtimes for tomorrow. Skipping generation.`);
    }
  } catch (error) {
    console.error('Error checking/generating next day showtimes:', error);
  }
});

// Root route
app.get('/', (req, res) => {
  res.send('CSP is set!');
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});

// Start the server with Socket.IO support
httpServer.listen(PORT, () => {
  console.log(`Server running at:${PORT} with Socket.IO support`);
});
