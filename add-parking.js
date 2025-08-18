import mongoose from 'mongoose';
import ParkingSlot from './api/models/parking.model.js';
import Showtime from './api/models/showtime.model.js';

// Connect to MongoDB
mongoose.connect('mongodb+srv://arunarivalagan774:arunhari27@movie-mern.iuov1.mongodb.net/?retryWrites=true&w=majority&appName=movie-mern')
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

async function addParkingSlots() {
  try {
    // Get all showtimes
    const showtimes = await Showtime.find();
    console.log(`Found ${showtimes.length} showtimes`);

    if (showtimes.length === 0) {
      console.log('No showtimes found. Please add showtimes first.');
      return;
    }

    // Clear existing parking slots
    await ParkingSlot.deleteMany({});
    console.log('Cleared existing parking slots');

    // Create parking slots for each showtime
    for (const showtime of showtimes) {
      const parkingSlots = [];
      
      // Create 50 parking slots (A1-A25, B1-B25)
      const sections = ['A', 'B'];
      for (const section of sections) {
        for (let i = 1; i <= 25; i++) {
          parkingSlots.push({
            slotNumber: `${section}${i}`,
            showtimeId: showtime._id,
            movieId: showtime.movieId,
            price: 5, // $5 for parking
            type: i <= 15 ? 'twoWheeler' : 'fourWheeler' // First 15 slots for two-wheelers, rest for four-wheelers
          });
        }
      }

      // Insert parking slots for this showtime
      await ParkingSlot.insertMany(parkingSlots);
      console.log(`Added ${parkingSlots.length} parking slots for showtime ${showtime._id}`);
    }

    console.log('Successfully added all parking slots!');
  } catch (error) {
    console.error('Error adding parking slots:', error);
  } finally {
    mongoose.disconnect();
  }
}

addParkingSlots();
