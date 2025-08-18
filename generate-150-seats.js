import mongoose from 'mongoose';
import Seat from './api/models/seat.model.js';
import Showtime from './api/models/showtime.model.js';

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://arunarivalagan774:qKn7OWd6YRDCELUx@cluster0.5lzqc.mongodb.net/mern-auth', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Function to generate 150 seats for a showtime
const generateSeatsForShowtime = (showtimeId, movieId) => {
  const seats = [];
  
  // Define seat layout for 150 seats
  // Rows A-P (16 rows) with varying seats per row
  const seatLayout = [
    // Premium rows (A-C) - 8 seats each = 24 seats
    { row: 'A', count: 8, category: 'Gold', price: 150 },
    { row: 'B', count: 8, category: 'Gold', price: 150 },
    { row: 'C', count: 8, category: 'Gold', price: 150 },
    
    // Standard rows (D-J) - 10 seats each = 70 seats  
    { row: 'D', count: 10, category: 'Silver', price: 150 },
    { row: 'E', count: 10, category: 'Silver', price: 150 },
    { row: 'F', count: 10, category: 'Silver', price: 150 },
    { row: 'G', count: 10, category: 'Silver', price: 150 },
    { row: 'H', count: 10, category: 'Silver', price: 150 },
    { row: 'I', count: 10, category: 'Silver', price: 150 },
    { row: 'J', count: 10, category: 'Silver', price: 150 },
    
    // Economy rows (K-P) - 9-10 seats each = 56 seats (Total: 24+70+56 = 150)
    { row: 'K', count: 9, category: 'Silver', price: 150 },
    { row: 'L', count: 9, category: 'Silver', price: 150 },
    { row: 'M', count: 10, category: 'Silver', price: 150 },
    { row: 'N', count: 10, category: 'Silver', price: 150 },
    { row: 'O', count: 9, category: 'Silver', price: 150 },
    { row: 'P', count: 9, category: 'Silver', price: 150 }
  ];
  
  seatLayout.forEach(({ row, count, category, price }) => {
    for (let i = 1; i <= count; i++) {
      seats.push({
        movieId,
        showtimeId,
        seatNumber: `${row}${i}`,
        category,
        price,
        status: 'AVAILABLE'
      });
    }
  });
  
  return seats;
};

// Main function to add 150 seats to all existing showtimes
const addSeatsToAllShowtimes = async () => {
  try {
    console.log('Starting to add 150 seats to all showtimes...');
    
    // Get all showtimes
    const showtimes = await Showtime.find({});
    console.log(`Found ${showtimes.length} showtimes`);
    
    for (const showtime of showtimes) {
      console.log(`Processing showtime: ${showtime._id}`);
      
      // Check if seats already exist for this showtime
      const existingSeats = await Seat.find({ showtimeId: showtime._id });
      
      if (existingSeats.length > 0) {
        console.log(`Showtime ${showtime._id} already has ${existingSeats.length} seats. Skipping...`);
        continue;
      }
      
      // Generate 150 seats for this showtime
      const seats = generateSeatsForShowtime(showtime._id, showtime.movieId);
      
      try {
        // Insert seats in batches to avoid memory issues
        const batchSize = 50;
        for (let i = 0; i < seats.length; i += batchSize) {
          const batch = seats.slice(i, i + batchSize);
          await Seat.insertMany(batch);
        }
        
        console.log(`✅ Added 150 seats to showtime ${showtime._id}`);
      } catch (error) {
        console.error(`❌ Error adding seats to showtime ${showtime._id}:`, error.message);
      }
    }
    
    console.log('✅ Completed adding seats to all showtimes');
    
    // Display summary
    const totalSeats = await Seat.countDocuments();
    const totalShowtimes = await Showtime.countDocuments();
    console.log(`\n📊 Summary:`);
    console.log(`Total showtimes: ${totalShowtimes}`);
    console.log(`Total seats: ${totalSeats}`);
    console.log(`Average seats per showtime: ${Math.round(totalSeats / totalShowtimes)}`);
    
  } catch (error) {
    console.error('Error in addSeatsToAllShowtimes:', error);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  }
};

// Run the script
connectDB().then(() => {
  addSeatsToAllShowtimes();
});
