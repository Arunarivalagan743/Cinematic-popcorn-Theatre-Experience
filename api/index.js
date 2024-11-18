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
// import userRoutes from './routes/user.route.js';
// import authRoutes from './routes/auth.route.js';
// import bookingRoutes from './routes/booking.route.js'; // Import booking routes
// import cookieParser from 'cookie-parser';

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5173;

// // Connect to MongoDB
// mongoose
//   .connect(process.env.MONGO)
//   .then(() => console.log('Connected to MongoDB'))
//   .catch((err) => console.error('MongoDB connection error:', err));

// // Middleware
// app.use(express.json());
// app.use(cookieParser());

// // Routes
// app.use('/api/user', userRoutes);
// app.use('/api/auth', authRoutes);
// app.use('/api/booking', bookingRoutes); // Use booking route

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
// import express from 'express';
// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import cors from 'cors';
// import cookieParser from 'cookie-parser';
// import userRoutes from './routes/user.route.js';
// import authRoutes from './routes/auth.route.js';
// import bookingRoutes from './routes/booking.route.js'; // Import booking routes
// import { MongoClient } from 'mongodb';

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 6000;

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use(cookieParser());

// // Connect to MongoDB using Mongoose
// mongoose
//   .connect(process.env.MONGO)
//   .then(() => console.log('Connected to MongoDB with Mongoose'))
//   .catch((err) => console.error('MongoDB connection error:', err));

// // Connect to MongoDB using MongoClient
// const client = new MongoClient(process.env.MONGO);
// const connectDB = async () => {
//   try {
//     await client.connect();
//     console.log('Connected to MongoDB with MongoClient');
//   } catch (error) {
//     console.error('MongoDB connection error:', error);
//     process.exit(1);
//   }
// };

// connectDB();

// // Routes
// app.use('/api/user', userRoutes);
// app.use('/api/auth', authRoutes);
// app.use('/api/booking', bookingRoutes); // Use booking route

// // Movie-related API routes
// app.post('/add-movie', async (req, res) => {
//   try {
//     const database = client.db('Clusters');
//     const collection = database.collection('movies');
//     const movieDataArray = req.body;

//     const result = await collection.insertMany(movieDataArray);
//     res.status(201).send(`Movies added with IDs: ${result.insertedIds}`);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Error adding movies');
//   }
// });

// app.get('/movies', async (req, res) => {
//   try {
//     const database = client.db('Clusters');
//     const collection = database.collection('movies');
//     const movies = await collection.find({}).toArray();
//     res.status(200).json(movies);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Error fetching movies');
//   }
// });

// app.patch('/update-movie/:movieName', async (req, res) => {
//   try {
//     const database = client.db('Clusters');
//     const collection = database.collection('movies');

//     const movieName = req.params.movieName;
//     const newImageUrl = req.body.imageUrl;

//     const result = await collection.updateOne(
//       { movieName: movieName },
//       { $set: { imageUrl: newImageUrl } }
//     );

//     if (result.modifiedCount > 0) {
//       res.send(`Image URL updated for movie: ${movieName}`);
//     } else {
//       res.send(`No movie found with name: ${movieName}`);
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Error updating movie image URL');
//   }
// });

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
//   console.log(`Server running at http://localhost:${PORT}`);
// });
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import movieRoutes from './routes/movie.route.js'; 
import bookingRoutes from './routes/booking.route.js'; // Import booking routes


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Connect to MongoDB using Mongoose
mongoose
  .connect(process.env.MONGO)
  .then(() => console.log('Connected to MongoDB with Mongoose'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Connect to MongoDB using MongoClient


// Routes
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);

app.use('/api/movies', movieRoutes);

app.use('/api/booking', bookingRoutes); // Use booking route

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
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
