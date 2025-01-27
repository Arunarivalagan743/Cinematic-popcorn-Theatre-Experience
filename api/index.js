
// import express from 'express';
// import mongoose from 'mongoose';


// import dotenv from 'dotenv';
// import cors from 'cors';
// import cookieParser from 'cookie-parser';
// import userRoutes from './routes/user.route.js';
// import authRoutes from './routes/auth.route.js';
// import movieRoutes from './routes/movie.route.js'; 
// import bookingRoutes from './routes/bookingRoutes.js';
// import confirmPaymentRoutes from './routes/confirmPaymentRoutes.js';   // Include `.js` extension
//  // Import booking routes
//  import  contactRoutes from './routes/contact.js';
//  import  faqRoutes  from './routes/faq.js';
 

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;
// const jwtSecret = process.env.JWT_SECRET;



// console.log('JWT Secret:', process.env.JWT_SECRET); // Should print your secret

// // Middleware

// app.use(express.json());
// app.use(cookieParser());

// // Connect to MongoDB using Mongoose
// mongoose
//   .connect(process.env.MONGO)
//   .then(() => console.log('Connected to MongoDB with Mongoose'))
//   .catch((err) => console.error('MongoDB connection error:', err));

// // Connect to MongoDB using MongoClient


// // Routes
// app.use('/api/user', userRoutes);
// app.use('/api/auth', authRoutes);

// app.use('/api/movies', movieRoutes);
// app.use('/api', bookingRoutes);
// app.use('/api', confirmPaymentRoutes);
// app.use('/api/contact', contactRoutes);
// app.use('/api/faq', faqRoutes);


// // Your other middleware and routes
// app.get('/', (req, res) => {
//   res.send('CSP is set!');
// });
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
//   console.log(`Server running at https://mern-auth-movie-6.onrender.com:${PORT}`);
// });
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';  // Importing cors correctly for ES modules
import cookieParser from 'cookie-parser';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import movieRoutes from './routes/movie.route.js';
import bookingRoutes from './routes/bookingRoutes.js';
import confirmPaymentRoutes from './routes/confirmPaymentRoutes.js';
import contactRoutes from './routes/contact.js';
import faqRoutes from './routes/faq.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const jwtSecret = process.env.JWT_SECRET;

console.log('JWT Secret:', process.env.JWT_SECRET); // Should print your secret

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS Configuration to allow requests from your Netlify frontend
app.use(cors({
  origin: 'https://classy-tartufo-a83e98.netlify.app',  // Your Netlify frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Specify allowed HTTP methods if needed
  credentials: true,  // Allow cookies to be sent across domains
}));

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

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at https://mern-auth-movie-6.onrender.com:${PORT}`);
});
