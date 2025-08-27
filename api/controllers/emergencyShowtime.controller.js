import Showtime from '../models/showtime.model.js';
import Movie from '../models/movie.model.js';
import Seat from '../models/seat.model.js';
import ParkingSlot from '../models/parking.model.js';
import { SeatStatus } from '../models/seat.model.js';
import { ParkingStatus } from '../models/parking.model.js';

// Emergency fix to generate showtimes for today and tomorrow with proper future times
export const emergencyGenerateShowtimes = async (req, res) => {
  try {
    console.log('Running emergency showtime generation...');
    
    // Get all active movies
    const movies = await Movie.find();
    console.log(`Found ${movies.length} movies`);
    
    if (movies.length === 0) {
      return res.status(400).json({ message: 'No movies found' });
    }
    
    const currentTime = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    // Clean up old showtimes first
    await Showtime.deleteMany({
      date: { 
        $gte: today, 
        $lt: new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000) 
      }
    });
    
    // Extended timing schedules for multiple shows per day
    const timingSchedules = [
      // Today - only future shows
      { 
        date: today, 
        timings: [
          { screen: 'Screen 1', start: '21:30', end: '23:30', cutoff: 5 },   // Tonight
          { screen: 'Screen 2', start: '22:00', end: '24:00', cutoff: 8 },   // Late night
        ]
      },
      // Tomorrow - full day schedule
      { 
        date: tomorrow, 
        timings: [
          { screen: 'Screen 1', start: '09:30', end: '12:00', cutoff: 5 },   // Morning
          { screen: 'Screen 1', start: '14:30', end: '17:00', cutoff: 5 },   // Afternoon
          { screen: 'Screen 1', start: '19:30', end: '22:00', cutoff: 5 },   // Evening
          { screen: 'Screen 2', start: '10:00', end: '12:30', cutoff: 8 },   // Morning
          { screen: 'Screen 2', start: '13:00', end: '15:30', cutoff: 8 },   // Afternoon
          { screen: 'Screen 2', start: '18:00', end: '20:30', cutoff: 8 },   // Evening
          { screen: 'Screen 3', start: '11:00', end: '13:30', cutoff: 15 },  // Late morning
          { screen: 'Screen 3', start: '16:00', end: '18:30', cutoff: 15 },  // Late afternoon
          { screen: 'Screen 3', start: '21:00', end: '23:30', cutoff: 15 }   // Night
        ]
      }
    ];
    
    let totalGenerated = 0;
    let todayGenerated = 0;
    let tomorrowGenerated = 0;
    
    // Generate showtimes for each day
    for (const schedule of timingSchedules) {
      for (let i = 0; i < movies.length; i++) {
        const movie = movies[i];
        
        // Assign multiple timings per movie
        const movieTimings = schedule.timings.filter((_, index) => index % movies.length === i);
        
        for (const timing of movieTimings) {
          const [startHour, startMinute] = timing.start.split(':').map(Number);
          const [endHour, endMinute] = timing.end.split(':').map(Number);
          
          const startTime = new Date(schedule.date);
          startTime.setHours(startHour, startMinute, 0, 0);
          
          const endTime = new Date(schedule.date);
          if (endHour >= 24) {
            endTime.setDate(endTime.getDate() + 1);
            endTime.setHours(endHour - 24, endMinute, 0, 0);
          } else {
            endTime.setHours(endHour, endMinute, 0, 0);
          }
          
          // For today, only create shows that are in the future
          if (schedule.date.getTime() === today.getTime() && startTime <= currentTime) {
            console.log(`Skipping past showtime for today: ${timing.start}`);
            continue;
          }
          
          console.log(`Creating showtime: ${movie.name} - ${timing.screen} - ${timing.start} on ${schedule.date.toDateString()}`);
          
          const newShowtime = await new Showtime({
            movieId: movie._id,
            screen: timing.screen,
            startTime,
            endTime,
            date: schedule.date,
            cutoffMinutes: timing.cutoff,
            isArchived: false
          }).save();
          
          // Create seats for this showtime
          await createSeatsForShowtime(movie._id, newShowtime._id);
          
          // Create parking slots for this showtime
          await createParkingForShowtime(movie._id, newShowtime._id);
          
          totalGenerated++;
          
          if (schedule.date.getTime() === today.getTime()) {
            todayGenerated++;
          } else {
            tomorrowGenerated++;
          }
        }
      }
    }
    
    // Get current status
    const todayShowtimes = await Showtime.find({
      date: { $gte: today, $lt: tomorrow },
      isArchived: false
    }).populate('movieId', 'name');
    
    const tomorrowShowtimes = await Showtime.find({
      date: { 
        $gte: tomorrow, 
        $lt: new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000) 
      },
      isArchived: false
    }).populate('movieId', 'name');
    
    res.status(200).json({
      message: 'Emergency showtime generation completed',
      totalGenerated,
      todayGenerated,
      tomorrowGenerated,
      currentStatus: {
        todayShowtimes: todayShowtimes.length,
        tomorrowShowtimes: tomorrowShowtimes.length
      },
      details: {
        today: todayShowtimes.map(st => ({
          movie: st.movieId.name,
          screen: st.screen,
          startTime: st.startTime,
          endTime: st.endTime
        })),
        tomorrow: tomorrowShowtimes.map(st => ({
          movie: st.movieId.name,
          screen: st.screen,
          startTime: st.startTime,
          endTime: st.endTime
        }))
      }
    });
  } catch (error) {
    console.error('Error in emergency showtime generation:', error);
    res.status(500).json({ message: 'Emergency generation failed', error: error.message });
  }
};

// Helper function to create seats for a showtime
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

// Helper function to create parking slots for a showtime
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
