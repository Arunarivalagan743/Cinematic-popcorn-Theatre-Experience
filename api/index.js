
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
      'https://cinemax-beta-ten.vercel.app',
      'https://www.cinexp.app'
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
  'https://cinemax-beta-ten.vercel.app',
  'https://www.cinexp.app'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
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

// Schedule jobs
// Release expired holds every minute
cron.schedule('* * * * *', async () => {
  try {
    // Import models here to avoid circular dependencies
    const Seat = mongoose.model('Seat');
    const ParkingSlot = mongoose.model('ParkingSlot');
    
    // Release expired seat holds
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
    console.error('Error in scheduled release of expired holds:', error);
  }
});

// Archive past showtimes daily at midnight
cron.schedule('0 0 * * *', async () => {
  try {
    await archivePastShowtimes();
  } catch (error) {
    console.error('Error archiving past showtimes:', error);
  }
});

// Generate next day's showtimes daily at 1 AM
cron.schedule('0 1 * * *', async () => {
  try {
    await generateNextDayShowtimes();
  } catch (error) {
    console.error('Error generating next day showtimes:', error);
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
