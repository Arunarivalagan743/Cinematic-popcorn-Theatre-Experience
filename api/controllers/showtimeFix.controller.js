import Showtime from '../models/showtime.model.js';
import Movie from '../models/movie.model.js';
import Seat from '../models/seat.model.js';
import ParkingSlot from '../models/parking.model.js';
import { SeatStatus } from '../models/seat.model.js';
import { ParkingStatus } from '../models/parking.model.js';

// Fix and regenerate showtimes for today and tomorrow
export const fixAndRegenerateShowtimes = async (req, res) => {
  try {
    console.log('Starting showtime fix and regeneration...');
    
    // Get all movies
    const movies = await Movie.find();
    if (movies.length === 0) {
      return res.status(400).json({ message: 'No movies found' });
    }
    
    // Calculate today and tomorrow dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    console.log(`Today: ${today.toISOString()}`);
    console.log(`Tomorrow: ${tomorrow.toISOString()}`);
    
    // Delete all existing showtimes for today and tomorrow to start fresh
    const deleteResult = await Showtime.deleteMany({
      date: {
        $gte: today,
        $lt: new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000)
      }
    });
    
    console.log(`Deleted ${deleteResult.deletedCount} existing showtimes`);
    
    // Also delete associated seats and parking slots
    await Seat.deleteMany({
      showtimeId: { $exists: true }
    });
    
    await ParkingSlot.deleteMany({
      showtimeId: { $exists: true }
    });
    
    console.log('Deleted associated seats and parking slots');
    
    // Define proper show timings
    const todayTimings = [
      { screen: 'Screen 1', start: '18:00', end: '20:30', cutoff: 5 },   // Evening show (only future shows for today)
      { screen: 'Screen 2', start: '19:30', end: '22:00', cutoff: 8 },   // Night show
      { screen: 'Screen 3', start: '21:00', end: '23:30', cutoff: 15 }   // Late night show
    ];
    
    const tomorrowTimings = [
      { screen: 'Screen 1', start: '09:30', end: '12:00', cutoff: 5 },   // Morning show
      { screen: 'Screen 1', start: '14:30', end: '17:00', cutoff: 5 },   // Afternoon show
      { screen: 'Screen 1', start: '19:30', end: '22:00', cutoff: 5 },   // Night show
      { screen: 'Screen 2', start: '10:00', end: '12:30', cutoff: 8 },   // Morning show
      { screen: 'Screen 2', start: '13:00', end: '15:30', cutoff: 8 },   // Afternoon show
      { screen: 'Screen 2', start: '18:00', end: '20:30', cutoff: 8 },   // Evening show
      { screen: 'Screen 3', start: '11:00', end: '13:30', cutoff: 15 },  // Late morning
      { screen: 'Screen 3', start: '16:00', end: '18:30', cutoff: 15 },  // Late afternoon
      { screen: 'Screen 3', start: '21:00', end: '23:30', cutoff: 15 }   // Late night
    ];
    
    let totalCreated = 0;
    
    // Create today's showtimes (only future shows)
    const currentTime = new Date();
    for (let i = 0; i < Math.min(movies.length, todayTimings.length); i++) {
      const movie = movies[i];
      const timing = todayTimings[i];
      
      const [startHour, startMinute] = timing.start.split(':').map(Number);
      const [endHour, endMinute] = timing.end.split(':').map(Number);
      
      const startTime = new Date(today);
      startTime.setHours(startHour, startMinute, 0, 0);
      
      const endTime = new Date(today);
      endTime.setHours(endHour, endMinute, 0, 0);
      
      // Only create if the show is in the future
      if (startTime > currentTime) {
        const newShowtime = await new Showtime({
          movieId: movie._id,
          screen: timing.screen,
          startTime,
          endTime,
          date: today,
          cutoffMinutes: timing.cutoff,
          isArchived: false
        }).save();
        
        await createSeatsForShowtime(movie._id, newShowtime._id);
        await createParkingForShowtime(movie._id, newShowtime._id);
        
        totalCreated++;
        console.log(`Created today's showtime: ${movie.name} in ${timing.screen} at ${timing.start}`);
      }
    }
    
    // Create tomorrow's showtimes
    for (let i = 0; i < Math.min(movies.length, tomorrowTimings.length); i++) {
      const movie = movies[i % movies.length]; // Cycle through movies if we have more slots than movies
      const timing = tomorrowTimings[i];
      
      const [startHour, startMinute] = timing.start.split(':').map(Number);
      const [endHour, endMinute] = timing.end.split(':').map(Number);
      
      const startTime = new Date(tomorrow);
      startTime.setHours(startHour, startMinute, 0, 0);
      
      const endTime = new Date(tomorrow);
      endTime.setHours(endHour, endMinute, 0, 0);
      
      const newShowtime = await new Showtime({
        movieId: movie._id,
        screen: timing.screen,
        startTime,
        endTime,
        date: tomorrow,
        cutoffMinutes: timing.cutoff,
        isArchived: false
      }).save();
      
      await createSeatsForShowtime(movie._id, newShowtime._id);
      await createParkingForShowtime(movie._id, newShowtime._id);
      
      totalCreated++;
      console.log(`Created tomorrow's showtime: ${movie.name} in ${timing.screen} at ${timing.start}`);
    }
    
    res.json({
      success: true,
      message: 'Showtimes fixed and regenerated successfully',
      totalCreated,
      todayDate: today.toISOString(),
      tomorrowDate: tomorrow.toISOString()
    });
    
  } catch (error) {
    console.error('Error fixing showtimes:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fix showtimes',
      error: error.message
    });
  }
};

// Helper functions
const createSeatsForShowtime = async (movieId, showtimeId) => {
  const seatCategories = {
    Gold: [0, 1, 2, 3, 4, 5],
    Platinum: [6, 7, 8, 9, 10, 11],
    Silver: [12, 13, 14, 15, 16, 17],
    Diamond: [18, 19, 20, 21, 22, 23],
    Balcony: [24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47],
  };
  
  const seatPrices = {
    Gold: 6,
    Platinum: 8,
    Silver: 3,
    Diamond: 10,
    Balcony: 5,
  };
  
  const rowLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  
  const seats = [];
  
  for (const [category, indices] of Object.entries(seatCategories)) {
    for (const index of indices) {
      const row = Math.floor(index / 6);
      const col = (index % 6) + 1;
      const seatNumber = `${rowLabels[row]}${col}`;
      
      seats.push({
        movieId,
        showtimeId,
        seatNumber,
        category,
        price: seatPrices[category],
        status: SeatStatus.AVAILABLE
      });
    }
  }
  
  await Seat.insertMany(seats);
};

const createParkingForShowtime = async (movieId, showtimeId) => {
  const twoWheelerSlots = Array.from({ length: 40 }, (_, i) => `T${i + 1}`);
  const fourWheelerSlots = Array.from({ length: 40 }, (_, i) => `F${i + 1}`);
  const twoWheelerPrice = 20;
  const fourWheelerPrice = 30;
  
  const parkingSlots = [];
  
  // Two-wheeler slots
  for (const slotNumber of twoWheelerSlots) {
    parkingSlots.push({
      movieId,
      showtimeId,
      slotNumber,
      type: 'twoWheeler',
      price: twoWheelerPrice,
      status: ParkingStatus.AVAILABLE
    });
  }
  
  // Four-wheeler slots
  for (const slotNumber of fourWheelerSlots) {
    parkingSlots.push({
      movieId,
      showtimeId,
      slotNumber,
      type: 'fourWheeler',
      price: fourWheelerPrice,
      status: ParkingStatus.AVAILABLE
    });
  }
  
  await ParkingSlot.insertMany(parkingSlots);
};
