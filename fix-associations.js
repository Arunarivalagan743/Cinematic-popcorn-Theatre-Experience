/**
 * Script to check and fix movie-showtime associations
 * 
 * This script:
 * 1. Connects to your MongoDB database
 * 2. Finds all movies and showtimes
 * 3. Verifies that showtimes are associated with movies
 * 4. Updates any missing associations
 * 
 * Usage:
 * - Make sure MongoDB connection string is correct
 * - Run with: node fix-associations.js
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config();

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define schemas
const movieSchema = new mongoose.Schema({
  name: String,
  genre: String,
  language: String,
  cast: String,
  screen: String,
  timing: String,
  ratings: { type: mongoose.Schema.Types.Mixed },
  votes: { type: mongoose.Schema.Types.Mixed },
  summary: String,
  imageUrl: String,
  showtimes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Showtime'
  }]
}, { timestamps: true, strict: false });

const showtimeSchema = new mongoose.Schema({
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true
  },
  screen: {
    type: String,
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  seatsAvailable: {
    type: Number,
    default: 64
  }
}, { timestamps: true });

// Define models
const Movie = mongoose.models.Movie || mongoose.model('Movie', movieSchema);
const Showtime = mongoose.models.Showtime || mongoose.model('Showtime', showtimeSchema);

// Connect to MongoDB
const MONGO_URI = process.env.MONGO || 'mongodb+srv://arunarivalagan774:arunhari27@movie-mern.iuov1.mongodb.net/?retryWrites=true&w=majority&appName=movie-mern';

try {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');
  
  // Get all movies
  const movies = await Movie.find();
  console.log(`Found ${movies.length} movies`);
  
  // Get all showtimes
  const showtimes = await Showtime.find();
  console.log(`Found ${showtimes.length} showtimes`);
  
  let fixedMovieRefs = 0;
  let fixedShowtimeRefs = 0;
  
  // Check and fix showtime references in movies
  for (const movie of movies) {
    // Get all showtimes for this movie
    const movieShowtimes = showtimes.filter(st => 
      st.movieId && st.movieId.toString() === movie._id.toString()
    );
    
    // Check if movie has these showtimes in its array
    if (!movie.showtimes) {
      movie.showtimes = [];
    }
    
    let modified = false;
    
    for (const showtime of movieShowtimes) {
      if (!movie.showtimes.includes(showtime._id)) {
        movie.showtimes.push(showtime._id);
        modified = true;
      }
    }
    
    if (modified) {
      await movie.save();
      fixedMovieRefs++;
      console.log(`Updated showtime references for movie: ${movie.name}`);
    }
  }
  
  // Check and fix movie references in showtimes
  for (const showtime of showtimes) {
    // Find movie that should be associated with this showtime
    const expectedMovie = movies.find(m => 
      m.screen === showtime.screen && 
      m.showtimes && 
      m.showtimes.some(stId => stId.toString() === showtime._id.toString())
    );
    
    if (expectedMovie && (!showtime.movieId || showtime.movieId.toString() !== expectedMovie._id.toString())) {
      showtime.movieId = expectedMovie._id;
      await showtime.save();
      fixedShowtimeRefs++;
      console.log(`Updated movie reference for showtime: ${showtime._id}`);
    }
  }
  
  console.log(`Fixed ${fixedMovieRefs} movie references and ${fixedShowtimeRefs} showtime references`);
  
} catch (error) {
  console.error('Error fixing associations:', error);
} finally {
  await mongoose.disconnect();
  console.log('Disconnected from MongoDB');
}
