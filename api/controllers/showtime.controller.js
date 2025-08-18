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
    
    const screens = ['Screen 1', 'Screen 2', 'Screen 3'];
    const showtimes = [
      { start: '10:00', end: '12:30' },
      { start: '13:30', end: '16:00' },
      { start: '16:30', end: '19:00' },
      { start: '19:30', end: '22:00' }
    ];
    
    // Track the number of new showtimes created
    let newShowtimesCount = 0;
    
    // For each movie, create showtimes in different screens
    for (const movie of movies) {
      // Distribute movies across screens
      const screenIndex = movies.indexOf(movie) % screens.length;
      const screen = screens[screenIndex];
      
      // Create showtimes for this movie in the assigned screen
      for (const time of showtimes) {
        const [startHour, startMinute] = time.start.split(':').map(Number);
        const [endHour, endMinute] = time.end.split(':').map(Number);
        
        const startTime = new Date(tomorrow);
        startTime.setHours(startHour, startMinute);
        
        const endTime = new Date(tomorrow);
        endTime.setHours(endHour, endMinute);
        
        // Check if this showtime already exists
        const existingShowtime = await Showtime.findOne({
          movieId: movie._id,
          screen,
          startTime: { $gte: startTime, $lt: new Date(startTime.getTime() + 60000) } // Within a minute
        });
        
        if (!existingShowtime) {
          const newShowtime = await new Showtime({
            movieId: movie._id,
            screen,
            startTime,
            endTime,
            date: tomorrow,
            cutoffMinutes: 15
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
        }
      }
    }
    
    console.log(`Generated ${newShowtimesCount} new showtimes for tomorrow`);
    return newShowtimesCount;
  } catch (error) {
    console.error('Error generating next day showtimes:', error);
    throw error;
  }
};
