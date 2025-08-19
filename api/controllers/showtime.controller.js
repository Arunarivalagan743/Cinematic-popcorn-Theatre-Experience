import mongoose from 'mongoose';
import Showtime from '../models/showtime.model.js';
import Movie from '../models/movie.model.js';
import Seat from '../models/seat.model.js';
import ParkingSlot from '../models/parking.model.js';
import { SeatStatus } from '../models/seat.model.js';
import { ParkingStatus } from '../models/parking.model.js';

// Create a new showtime
export const createShowtime = async (req, res) => {
  try {
    const { movieId, screen, startTime, endTime, date, cutoffMinutes } = req.body;

    // Check if the movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Create a new showtime
    const newShowtime = new Showtime({
      movieId,
      screen,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      date: new Date(date),
      cutoffMinutes: cutoffMinutes || 15
    });

    // Save the showtime
    const savedShowtime = await newShowtime.save();

    // Create seats for this showtime
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
    
    // Bulk insert seats
    const seats = [];
    let seatIndex = 0;
    
    for (const [category, indices] of Object.entries(seatCategories)) {
      for (const index of indices) {
        const row = Math.floor(index / 6);
        const col = (index % 6) + 1;
        const seatNumber = `${rowLabels[row]}${col}`;
        
        seats.push({
          movieId,
          showtimeId: savedShowtime._id,
          seatNumber,
          category,
          price: seatPrices[category],
          status: SeatStatus.AVAILABLE
        });
        
        seatIndex++;
      }
    }
    
    await Seat.insertMany(seats);

    // Create parking slots for this showtime
    const twoWheelerSlots = Array.from({ length: 40 }, (_, i) => `T${i + 1}`);
    const fourWheelerSlots = Array.from({ length: 40 }, (_, i) => `F${i + 1}`);
    const twoWheelerPrice = 20;
    const fourWheelerPrice = 30;
    
    const parkingSlots = [];
    
    // Two-wheeler slots
    for (const slotNumber of twoWheelerSlots) {
      parkingSlots.push({
        movieId,
        showtimeId: savedShowtime._id,
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
        showtimeId: savedShowtime._id,
        slotNumber,
        type: 'fourWheeler',
        price: fourWheelerPrice,
        status: ParkingStatus.AVAILABLE
      });
    }
    
    await ParkingSlot.insertMany(parkingSlots);

    res.status(201).json({
      showtime: savedShowtime,
      message: 'Showtime created successfully with seats and parking slots'
    });
  } catch (error) {
    console.error('Error creating showtime:', error);
    res.status(500).json({ message: 'Failed to create showtime', error: error.message });
  }
};

// Get all showtimes
export const getAllShowtimes = async (req, res) => {
  try {
    const showtimes = await Showtime.find({ isArchived: false })
      .populate('movieId', 'name imageUrl duration')
      .sort({ date: 1, startTime: 1 });
    
    res.status(200).json(showtimes);
  } catch (error) {
    console.error('Error fetching showtimes:', error);
    res.status(500).json({ message: 'Failed to fetch showtimes', error: error.message });
  }
};

// Get showtimes for a specific movie
export const getShowtimesByMovie = async (req, res) => {
  try {
    const { movieId } = req.params;
    
    const currentDate = new Date();
    
    const showtimes = await Showtime.find({ 
      movieId, 
      isArchived: false,
      startTime: { $gt: currentDate } // Only future showtimes
    }).sort({ date: 1, startTime: 1 });
    
    res.status(200).json(showtimes);
  } catch (error) {
    console.error('Error fetching showtimes for movie:', error);
    res.status(500).json({ message: 'Failed to fetch showtimes', error: error.message });
  }
};

// Get a specific showtime by ID
export const getShowtimeById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check for valid ObjectId to prevent casting errors
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.error('Error fetching showtime: Invalid ID format', id);
      return res.status(400).json({ message: 'Invalid showtime ID format' });
    }
    
    const showtime = await Showtime.findById(id)
      .populate('movieId', 'name imageUrl duration');
    
    if (!showtime) {
      console.error('Error fetching showtime: Showtime not found for ID:', id);
      return res.status(404).json({ message: 'Showtime not found' });
    }
    
    res.status(200).json(showtime);
  } catch (error) {
    console.error('Error fetching showtime:', error);
    res.status(500).json({ message: 'Failed to fetch showtime', error: error.message });
  }
};

// Archive past showtimes
export const archivePastShowtimes = async () => {
  try {
    const currentDate = new Date();
    
    const result = await Showtime.updateMany(
      { endTime: { $lt: currentDate }, isArchived: false },
      { $set: { isArchived: true } }
    );
    
    console.log(`Archived ${result.modifiedCount} past showtimes`);
    return result.modifiedCount;
  } catch (error) {
    console.error('Error archiving past showtimes:', error);
    throw error;
  }
};

// Generate showtimes for the next day
export const generateNextDayShowtimes = async () => {
  try {
    // Get all active movies
    const movies = await Movie.find();
    
    // Calculate the date for tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    // Different show timings for each screen - one timing per screen
    const screenTimings = [
      { screen: 'Screen 1', start: '09:30', end: '12:00', cutoff: 5 },   // Morning show
      { screen: 'Screen 2', start: '13:00', end: '15:30', cutoff: 8 },   // Afternoon show  
      { screen: 'Screen 3', start: '19:30', end: '22:00', cutoff: 15 }   // Night show
    ];
    
    // Track the number of new showtimes created
    let newShowtimesCount = 0;
    
    // For each movie, assign to one screen with one specific timing
    for (let i = 0; i < movies.length; i++) {
      const movie = movies[i];
      
      // Distribute movies across screens (one movie per screen)
      const screenIndex = i % screenTimings.length;
      const assignedTiming = screenTimings[screenIndex];
      
      const [startHour, startMinute] = assignedTiming.start.split(':').map(Number);
      const [endHour, endMinute] = assignedTiming.end.split(':').map(Number);
      
      const startTime = new Date(tomorrow);
      startTime.setHours(startHour, startMinute);
      
      const endTime = new Date(tomorrow);
      endTime.setHours(endHour, endMinute);
      
      // Check if this showtime already exists
      const existingShowtime = await Showtime.findOne({
        movieId: movie._id,
        screen: assignedTiming.screen,
        startTime: { $gte: startTime, $lt: new Date(startTime.getTime() + 60000) } // Within a minute
      });
      
      if (!existingShowtime) {
        const newShowtime = await new Showtime({
          movieId: movie._id,
          screen: assignedTiming.screen,
          startTime,
          endTime,
          date: tomorrow,
          cutoffMinutes: assignedTiming.cutoff
        }).save();
        
        // Create seats for this showtime
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
        
        // Bulk insert seats
        const seats = [];
        let seatIndex = 0;
        
        for (const [category, indices] of Object.entries(seatCategories)) {
          for (const index of indices) {
            const row = Math.floor(index / 6);
            const col = (index % 6) + 1;
            const seatNumber = `${rowLabels[row]}${col}`;
            
            seats.push({
              movieId: movie._id,
              showtimeId: newShowtime._id,
              seatNumber,
              category,
              price: seatPrices[category],
              status: SeatStatus.AVAILABLE
            });
            
            seatIndex++;
          }
        }
        
        await Seat.insertMany(seats);

        // Create parking slots for this showtime
        const twoWheelerSlots = Array.from({ length: 40 }, (_, i) => `T${i + 1}`);
        const fourWheelerSlots = Array.from({ length: 40 }, (_, i) => `F${i + 1}`);
        const twoWheelerPrice = 20;
        const fourWheelerPrice = 30;
        
        const parkingSlots = [];
        
        // Two-wheeler slots
        for (const slotNumber of twoWheelerSlots) {
          parkingSlots.push({
            movieId: movie._id,
            showtimeId: newShowtime._id,
            slotNumber,
            type: 'twoWheeler',
            price: twoWheelerPrice,
            status: ParkingStatus.AVAILABLE
          });
        }
        
        // Four-wheeler slots
        for (const slotNumber of fourWheelerSlots) {
          parkingSlots.push({
            movieId: movie._id,
            showtimeId: newShowtime._id,
            slotNumber,
            type: 'fourWheeler',
            price: fourWheelerPrice,
            status: ParkingStatus.AVAILABLE
          });
        }
        
        await ParkingSlot.insertMany(parkingSlots);
        
        newShowtimesCount++;
        console.log(`Generated showtime for ${movie.name} in ${assignedTiming.screen} at ${assignedTiming.start}-${assignedTiming.end}`);
      }
    }
    
    console.log(`Generated ${newShowtimesCount} new showtimes for tomorrow`);
    return newShowtimesCount;
  } catch (error) {
    console.error('Error generating next day showtimes:', error);
    throw error;
  }
};

export const generateTodayShowtimes = async () => {
  try {
    console.log('Generating today\'s showtimes with future times...');
    
    // Get all active movies
    const movies = await Movie.find();
    
    // Calculate today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Current time to check what shows are still in the future
    const currentTime = new Date();
    
    // Different show timings for each screen - use future times for today
    const screenTimings = [
      { screen: 'Screen 1', start: '14:30', end: '17:00', cutoff: 5 },   // Afternoon show
      { screen: 'Screen 2', start: '18:00', end: '20:30', cutoff: 8 },   // Evening show  
      { screen: 'Screen 3', start: '21:00', end: '23:30', cutoff: 15 }   // Night show
    ];
    
    // Delete existing showtimes for today to avoid conflicts
    await Showtime.deleteMany({
      date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) }
    });
    console.log('Deleted existing showtimes for today');
    
    // Track the number of new showtimes created
    let newShowtimesCount = 0;
    
    // For each movie, assign to one screen with one specific timing
    for (let i = 0; i < movies.length; i++) {
      const movie = movies[i];
      const timing = screenTimings[i % screenTimings.length]; // Cycle through screens
      
      const [startHour, startMinute] = timing.start.split(':').map(Number);
      const [endHour, endMinute] = timing.end.split(':').map(Number);
      
      const startTime = new Date(today);
      startTime.setHours(startHour, startMinute);
      
      const endTime = new Date(today);
      endTime.setHours(endHour, endMinute);
      
      // Only create showtime if it's in the future
      if (startTime > currentTime) {
        const newShowtime = await new Showtime({
          movieId: movie._id,
          screen: timing.screen,
          startTime,
          endTime,
          date: today,
          cutoffMinutes: timing.cutoff
        }).save();
        
        // Create seats for this showtime
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
        
        // Bulk insert seats
        const seats = [];
        
        for (const [category, indices] of Object.entries(seatCategories)) {
          for (const index of indices) {
            const row = Math.floor(index / 6);
            const col = (index % 6) + 1;
            const seatNumber = `${rowLabels[row]}${col}`;
            
            seats.push({
              movieId: movie._id,
              showtimeId: newShowtime._id,
              seatNumber,
              category,
              price: seatPrices[category],
              status: SeatStatus.AVAILABLE
            });
          }
        }
        
        await Seat.insertMany(seats);

        // Create parking slots for this showtime
        const twoWheelerSlots = Array.from({ length: 40 }, (_, i) => `T${i + 1}`);
        const fourWheelerSlots = Array.from({ length: 40 }, (_, i) => `F${i + 1}`);
        const twoWheelerPrice = 20;
        const fourWheelerPrice = 30;
        
        const parkingSlots = [];
        
        // Two-wheeler slots
        for (const slotNumber of twoWheelerSlots) {
          parkingSlots.push({
            movieId: movie._id,
            showtimeId: newShowtime._id,
            slotNumber,
            type: 'twoWheeler',
            price: twoWheelerPrice,
            status: ParkingStatus.AVAILABLE
          });
        }
        
        // Four-wheeler slots
        for (const slotNumber of fourWheelerSlots) {
          parkingSlots.push({
            movieId: movie._id,
            showtimeId: newShowtime._id,
            slotNumber,
            type: 'fourWheeler',
            price: fourWheelerPrice,
            status: ParkingStatus.AVAILABLE
          });
        }
        
        await ParkingSlot.insertMany(parkingSlots);
        
        newShowtimesCount++;
        console.log(`Created showtime for ${movie.name} in ${timing.screen} at ${timing.start}-${timing.end}`);
      } else {
        console.log(`Skipped ${movie.name} showtime at ${timing.start} as it's in the past`);
      }
    }
    
    console.log(`Generated ${newShowtimesCount} new showtimes for today`);
    return newShowtimesCount;
  } catch (error) {
    console.error('Error generating today\'s showtimes:', error);
    throw error;
  }
};

// Function to update existing showtimes with new varied timings
export const updateExistingShowtimes = async () => {
  try {
    console.log('Updating existing showtimes with varied timings...');
    
    // Get today's showtimes
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const existingShowtimes = await Showtime.find({
      date: { $gte: today, $lt: tomorrow },
      isArchived: false
    }).populate('movieId');
    
    // New timing configurations for each screen - each screen gets one unique time slot
    const screenTimings = [
      { screen: 'Screen 1', start: '09:30', end: '12:00', cutoff: 5 },   // Morning show
      { screen: 'Screen 2', start: '13:00', end: '15:30', cutoff: 8 },   // Afternoon show  
      { screen: 'Screen 3', start: '19:30', end: '22:00', cutoff: 15 }   // Night show
    ];
    
    let updatedCount = 0;
    
    // Group showtimes by movie to ensure each movie gets one showtime per screen
    const showtimesByMovie = {};
    existingShowtimes.forEach(showtime => {
      const movieId = showtime.movieId._id.toString();
      if (!showtimesByMovie[movieId]) {
        showtimesByMovie[movieId] = [];
      }
      showtimesByMovie[movieId].push(showtime);
    });
    
    // Get all movies and assign them to different screens
    const movies = Object.keys(showtimesByMovie);
    
    // Assign each movie to one screen with one specific timing
    for (let i = 0; i < movies.length; i++) {
      const movieId = movies[i];
      const movieShowtimes = showtimesByMovie[movieId];
      
      // Assign this movie to a screen (distribute movies across screens)
      const screenIndex = i % screenTimings.length;
      const assignedTiming = screenTimings[screenIndex];
      
      // Delete all existing showtimes for this movie
      await Showtime.deleteMany({ 
        movieId: movieId,
        date: { $gte: today, $lt: tomorrow },
        isArchived: false
      });
      
      // Create one new showtime for this movie in the assigned screen
      const [startHour, startMinute] = assignedTiming.start.split(':').map(Number);
      const [endHour, endMinute] = assignedTiming.end.split(':').map(Number);
      
      const newStartTime = new Date(today);
      newStartTime.setHours(startHour, startMinute, 0, 0);
      
      const newEndTime = new Date(today);
      newEndTime.setHours(endHour, endMinute, 0, 0);
      
      // Get the first showtime to get movie reference
      const originalShowtime = movieShowtimes[0];
      
      const newShowtime = await new Showtime({
        movieId: movieId,
        screen: assignedTiming.screen,
        startTime: newStartTime,
        endTime: newEndTime,
        date: today,
        cutoffMinutes: assignedTiming.cutoff
      }).save();
      
      // Create seats for this new showtime
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
      
      // Remove existing seats for this movie today
      await Seat.deleteMany({
        movieId: movieId,
        showtimeId: { $in: movieShowtimes.map(st => st._id) }
      });
      
      // Create new seats
      const seats = [];
      for (const [category, indices] of Object.entries(seatCategories)) {
        for (const index of indices) {
          const row = Math.floor(index / 6);
          const col = (index % 6) + 1;
          const seatNumber = `${rowLabels[row]}${col}`;
          
          seats.push({
            movieId: movieId,
            showtimeId: newShowtime._id,
            seatNumber,
            category,
            price: seatPrices[category],
            status: SeatStatus.AVAILABLE
          });
        }
      }
      
      await Seat.insertMany(seats);

      // Create parking slots for this new showtime
      const twoWheelerSlots = Array.from({ length: 40 }, (_, i) => `T${i + 1}`);
      const fourWheelerSlots = Array.from({ length: 40 }, (_, i) => `F${i + 1}`);
      const twoWheelerPrice = 20;
      const fourWheelerPrice = 30;
      
      // Remove existing parking slots for this movie today
      await ParkingSlot.deleteMany({
        movieId: movieId,
        showtimeId: { $in: movieShowtimes.map(st => st._id) }
      });
      
      const parkingSlots = [];
      
      // Two-wheeler slots
      for (const slotNumber of twoWheelerSlots) {
        parkingSlots.push({
          movieId: movieId,
          showtimeId: newShowtime._id,
          slotNumber,
          type: 'twoWheeler',
          price: twoWheelerPrice,
          status: ParkingStatus.AVAILABLE
        });
      }
      
      // Four-wheeler slots
      for (const slotNumber of fourWheelerSlots) {
        parkingSlots.push({
          movieId: movieId,
          showtimeId: newShowtime._id,
          slotNumber,
          type: 'fourWheeler',
          price: fourWheelerPrice,
          status: ParkingStatus.AVAILABLE
        });
      }
      
      await ParkingSlot.insertMany(parkingSlots);
      
      updatedCount++;
      console.log(`Updated ${originalShowtime.movieId.name} in ${assignedTiming.screen} to ${assignedTiming.start}-${assignedTiming.end}`);
    }
    
    console.log(`Updated ${updatedCount} movies with new distinct showtimes`);
    return updatedCount;
  } catch (error) {
    console.error('Error updating existing showtimes:', error);
    throw error;
  }
};
