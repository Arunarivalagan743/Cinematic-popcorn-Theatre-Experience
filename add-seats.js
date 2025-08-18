/**
 * Script to add seats for existing showtimes
 * 
 * This script:
 * 1. Connects to your MongoDB database
 * 2. Finds all showtimes
 * 3. For each showtime, creates seats if they don't exist
 * 
 * Usage:
 * - Make sure MongoDB connection string is correct
 * - Run with: node add-seats.js
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

const seatSchema = new mongoose.Schema({
  showtimeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Showtime',
    required: true
  },
  seatNumber: {
    type: String,
    required: true
  },
  row: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['AVAILABLE', 'BOOKED', 'HELD', 'MAINTENANCE'],
    default: 'AVAILABLE'
  },
  category: {
    type: String,
    enum: ['STANDARD', 'PREMIUM', 'VIP'],
    default: 'STANDARD'
  },
  price: {
    type: Number,
    default: 10
  }
}, { timestamps: true });

// Define models
const Showtime = mongoose.models.Showtime || mongoose.model('Showtime', showtimeSchema);
const Seat = mongoose.models.Seat || mongoose.model('Seat', seatSchema);

// Connect to MongoDB
const MONGO_URI = process.env.MONGO || 'mongodb+srv://arunarivalagan774:arunhari27@movie-mern.iuov1.mongodb.net/?retryWrites=true&w=majority&appName=movie-mern';

try {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');
  
  // Find all showtimes
  const showtimes = await Showtime.find();
  console.log(`Found ${showtimes.length} showtimes`);
  
  let createdCount = 0;
  let skipCount = 0;
  
  for (const showtime of showtimes) {
    console.log(`Processing showtime: ${showtime._id} for screen ${showtime.screen}`);
    
    // Check if seats already exist for this showtime
    const existingSeats = await Seat.countDocuments({ showtimeId: showtime._id });
    
    if (existingSeats > 0) {
      console.log(`Seats already exist for showtime ${showtime._id} (${existingSeats} seats). Skipping.`);
      skipCount++;
      continue;
    }
    
    // Create a standard 8x8 grid of seats (A1-H8)
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const seatsPerRow = 8;
    const seats = [];
    
    for (let r = 0; r < rows.length; r++) {
      const row = rows[r];
      
      for (let s = 1; s <= seatsPerRow; s++) {
        // Determine seat category based on row
        let category = 'STANDARD';
        let price = 10;
        
        if (r >= 3 && r < 5) {
          category = 'PREMIUM';
          price = 15;
        } else if (r >= 5) {
          category = 'VIP';
          price = 25;
        }
        
        const seatNumber = `${s}`;
        seats.push({
          showtimeId: showtime._id,
          seatNumber,
          row,
          status: 'AVAILABLE',
          category,
          price
        });
      }
    }
    
    // Insert all seats
    await Seat.insertMany(seats);
    
    console.log(`Created ${seats.length} seats for showtime ${showtime._id}`);
    createdCount += seats.length;
  }
  
  console.log(`Successfully created ${createdCount} seats for ${showtimes.length - skipCount} showtimes`);
  console.log(`Skipped ${skipCount} showtimes that already had seats`);
  
} catch (error) {
  console.error('Error adding seats:', error);
} finally {
  await mongoose.disconnect();
  console.log('Disconnected from MongoDB');
}
