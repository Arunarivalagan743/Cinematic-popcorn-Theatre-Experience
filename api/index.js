// import express from 'express';
// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import userRoutes from './routes/user.route.js';
// import authRoutes from './routes/auth.route.js';
// import cookieParser from 'cookie-parser';

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 6000;

// // Connect to MongoDB
// mongoose
//   .connect(process.env.MONGO)
//   .then(() => {
//     console.log('Connected to MongoDB');
//   })
//   .catch((err) => {
//     console.error('MongoDB connection error:', err);
//   });

// // Middleware
// app.use(express.json());
// app.use(cookieParser());

// app.use('/api/user', userRoutes);
// app.use('/api/auth', authRoutes);

// // Global error handler
// app.use((err, req, res, next) => {
//   const statusCode = err.statusCode || 500;
//   const message = err.message || 'Internal Server Error';
//   res.status(statusCode).json({
//     success: false,
//     message,
//     statusCode,
//   });
// });

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server listening on port ${PORT}`);
// });




// server.js
// import express from 'express';
// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import cookieParser from 'cookie-parser';
// import userRoutes from './routes/user.route.js';
// import authRoutes from './routes/auth.route.js';
// import bookingRoutes from './routes/booking.route.js'; // Booking route
// // import { authenticateToken } from './middleware/authMiddleware.js'; // JWT middleware
// import morgan from 'morgan';
// const cors = require('cors');


// dotenv.config();

// const app = express();
// const mongoUri = process.env.MONGO; // MongoDB URI from env variables
// const jwtSecret = process.env.JWT_SECRET; // JWT secret from env variables
// const port = process.env.PORT || 5173; // Port to run the server

// if (!mongoUri || !jwtSecret) {
//   console.error('MongoDB URI or JWT Secret is not set in environment variables');
//   process.exit(1);
// }

// mongoose.connect(mongoUri).then(() => {
//   console.log('Connected to MongoDB');
// }).catch(err => {
//   console.error('MongoDB connection error:', err);
// });

// app.use(morgan('dev')); // HTTP request logging
// app.use(express.json());
// app.use(cookieParser());
// app.use(cors());

// app.use('/api/user', userRoutes);
// app.use('/api/auth', authRoutes);
// // Protect booking route
// app.use('/api/checking', bookingRoutes); // This is where the route is handled

// // Global error handler
// app.use((err, req, res, next) => {
//   const statusCode = err.statusCode || 500;
//   const message = err.message || 'Internal Server Error';
//   res.status(statusCode).json({
//     success: false,
//     message,
//     statusCode,
//   });
// });

// app.listen(port, () => {
//   console.log(`Server listening on port ${port}`);
// });
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import bookingRoutes from './routes/booking.route.js'; // Booking route
import morgan from 'morgan';
import cors from 'cors'; // CORS middleware

dotenv.config();

const app = express();
const mongoUri = process.env.MONGO; // MongoDB URI from env variables
const jwtSecret = process.env.JWT_SECRET; // JWT secret from env variables
const port = process.env.PORT || 6000; // Port to run the server

// Check if required environment variables are set
if (!mongoUri || !jwtSecret) {
  console.error('MongoDB URI or JWT Secret is not set in environment variables');
  process.exit(1);
}

// Connect to MongoDB
mongoose.connect(mongoUri)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// Middleware setup
app.use(morgan('dev')); // HTTP request logging
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:5173', credentials: true })); // Allow frontend requests

// Routes setup
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/checking', bookingRoutes); // Booking route for checking availability

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
