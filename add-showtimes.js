/**
 * Script to add showtimes for existing movies
 * 
 * This script:
 * 1. Connects to your MongoDB database
 * 2. Finds all movies without showtimes
 * 3. Creates showtimes based on their timing field
 * 4. Updates movie documents with references to the new showtimes
 * 
 * Usage:
 * - Make sure MongoDB connection string is correct
 * - Run with: node add-showtimes.js
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import models (need to define them here since we can't require directly)
// We'll define them below instead of importing

// Define schemas and models directly
const movieSchema = new mongoose.Schema({
  name: String,
  genre: String,
  language: String,
  cast: String,
  screen: String,
  timing: String,
  ratings: { type: mongoose.Schema.Types.Mixed },
  votes: { type: mongoose.Schema.Types.Mixed }, // Allow both string and number for votes
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
} catch (err) {
  console.error('MongoDB connection error:', err);
  process.exit(1);
}

/**
 * Parse time string into hours and minutes
 * Handles formats like "10:00 AM", "6:00 PM", "14:30"
 */
function parseTimeString(timeStr) {
  let hours = 0;
  let minutes = 0;
  
  // Strip any whitespace
  timeStr = timeStr.trim();
  
  // Check for AM/PM format
  const isPM = timeStr.toLowerCase().includes('pm');
  const isAM = timeStr.toLowerCase().includes('am');
  
  // Remove AM/PM
  timeStr = timeStr.toLowerCase().replace('am', '').replace('pm', '').trim();
  
  // Split hours and minutes
  const parts = timeStr.split(':');
  hours = parseInt(parts[0], 10);
  minutes = parts.length > 1 ? parseInt(parts[1], 10) : 0;
  
  // Convert to 24-hour format if PM
  if (isPM && hours < 12) {
    hours += 12;
  }
  
  // Handle 12 AM edge case
  if (isAM && hours === 12) {
    hours = 0;
  }
  
  return { hours, minutes };
}

/**
 * Creates a date object from a time string and an optional date
 */
function createDateFromTimeString(timeStr, baseDate = new Date()) {
  const { hours, minutes } = parseTimeString(timeStr);
  const date = new Date(baseDate);
  date.setHours(hours, minutes, 0, 0);
  return date;
}

/**
 * Add showtimes for all movies that don't have them
 */
  // Main function to add showtimes
try {
  // Find all movies
  const movies = await Movie.find();
  console.log(`Found ${movies.length} movies`);
  
  let createdCount = 0;
  let updatedCount = 0;
  
  for (const movie of movies) {
    // Check if movie already has showtimes
    if (movie.showtimes && movie.showtimes.length > 0) {
      console.log(`Movie "${movie.name}" already has showtimes. Skipping.`);
      continue;
    }
    
    console.log(`Processing "${movie.name}" on screen ${movie.screen} at ${movie.timing}`);
    
    // Create dates for the showtime
    const startTime = createDateFromTimeString(movie.timing);
    
    // Estimate end time (2.5 hours after start)
    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + 150); // 2.5 hours = 150 minutes
    
    try {
      // First check if a showtime already exists for this screen and time
      const existingShowtime = await Showtime.findOne({
        screen: movie.screen,
        startTime: {
          $gte: new Date(startTime.getTime() - 15 * 60000), // Within 15 minutes
          $lte: new Date(startTime.getTime() + 15 * 60000)
        }
      });
      
      let showtimeId;
      
      if (existingShowtime) {
        // Update the existing showtime with the movie ID
        existingShowtime.movieId = movie._id;
        await existingShowtime.save();
        showtimeId = existingShowtime._id;
        updatedCount++;
        console.log(`Updated existing showtime for "${movie.name}" at ${startTime.toLocaleTimeString()}`);
      } else {
        // Create a new showtime document
        const showtime = new Showtime({
          movieId: movie._id,
          screen: movie.screen,
          startTime: startTime,
          endTime: endTime,
          isActive: true,
          seatsAvailable: 64
        });
        
        // Save the showtime
        await showtime.save();
        showtimeId = showtime._id;
        createdCount++;
        console.log(`Created new showtime for "${movie.name}" at ${startTime.toLocaleTimeString()}`);
      }
      
      // Update the movie with a reference to the showtime
      if (!movie.showtimes) {
        movie.showtimes = [];
      }
      movie.showtimes.push(showtimeId);
      await movie.save();
    } catch (e) {
      console.error(`Error processing showtime for ${movie.name}:`, e.message);
    }
  }  console.log(`Successfully created ${createdCount} new showtimes and updated ${updatedCount} existing showtimes`);
} catch (error) {
  console.error('Error adding showtimes:', error);
} finally {
  await mongoose.disconnect();
  console.log('Disconnected from MongoDB');
}
