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
    // Set to start of today to include all of today's shows
    const startOfToday = new Date(currentDate);
    startOfToday.setHours(0, 0, 0, 0);
    
    // First check if we need to archive any expired showtimes
    await archivePastShowtimes();
    
    // Get all non-archived showtimes for this movie that are today or in the future
    const showtimes = await Showtime.find({ 
      movieId, 
      isArchived: false,
      date: { $gte: startOfToday } // Only today and future dates
    }).sort({ date: 1, startTime: 1 });
    
    // Add booking availability information to each showtime
    const showtimesWithAvailability = showtimes.map(showtime => {
      const showtimeStart = new Date(showtime.startTime);
      const showtimeEnd = new Date(showtime.endTime);
      const cutoffTime = new Date(showtimeStart.getTime() - (showtime.cutoffMinutes * 60000));
      
      // Determine if booking is available
      const bookingAvailable = currentDate <= cutoffTime && 
                               currentDate < showtimeStart && 
                               currentDate < showtimeEnd &&
                               !showtime.isArchived;
      
      return {
        ...showtime.toObject(),
        bookingAvailable
      };
    });
    
    res.status(200).json(showtimesWithAvailability);
  } catch (error) {
    console.error('Error fetching showtimes for movie:', error);
    res.status(500).json({ message: 'Failed to fetch showtimes', error: error.message });
  }
};

// Get a specific showtime by ID
export const getShowtimeById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // First, check for and archive past showtimes
    await archivePastShowtimes();
    
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
    
    // Check if showtime has already ended or is archived
    const currentTime = new Date();
    const showtimeEnd = new Date(showtime.endTime);
    
    if (showtime.isArchived) {
      // Return the showtime with a flag indicating it's archived
      return res.status(200).json({
        ...showtime._doc,
        bookingAvailable: false,
        statusMessage: 'This showtime has been archived'
      });
    }
    
    if (currentTime > showtimeEnd) {
      // Return the showtime with a flag indicating it has ended
      return res.status(200).json({
        ...showtime._doc,
        bookingAvailable: false,
        statusMessage: 'This showtime has already ended'
      });
    }
    
    // Check if showtime has already started
    const showtimeStart = new Date(showtime.startTime);
    if (currentTime > showtimeStart) {
      return res.status(200).json({
        ...showtime._doc,
        bookingAvailable: false,
        statusMessage: 'This showtime has already started'
      });
    }
    
    // Check if cutoff time has passed
    const cutoffTime = new Date(showtimeStart.getTime() - (showtime.cutoffMinutes * 60000));
    if (currentTime > cutoffTime) {
      return res.status(200).json({
        ...showtime._doc,
        bookingAvailable: false,
        statusMessage: `Booking cutoff time (${showtime.cutoffMinutes} minutes before showtime) has passed`
      });
    }
    
    // Showtime is bookable
    res.status(200).json({
      ...showtime._doc,
      bookingAvailable: true
    });
  } catch (error) {
    console.error('Error fetching showtime:', error);
    res.status(500).json({ message: 'Failed to fetch showtime', error: error.message });
  }
};

// Archive past showtimes
export const archivePastShowtimes = async () => {
  try {
    const currentDate = new Date();
    console.log(`Running archivePastShowtimes at ${currentDate.toISOString()}`);
    
    // First, find all showtimes that should be archived
    const showtimesToArchive = await Showtime.find({
      endTime: { $lt: currentDate },
      isArchived: false
    });
    
    if (showtimesToArchive.length > 0) {
      console.log(`Found ${showtimesToArchive.length} showtimes to archive:`, 
        showtimesToArchive.map(st => ({
          id: st._id,
          movieId: st.movieId,
          screen: st.screen,
          startTime: st.startTime,
          endTime: st.endTime
        }))
      );
    }
    
    // Archive showtimes that have ended (end time is in the past)
    const result = await Showtime.updateMany(
      { endTime: { $lt: currentDate }, isArchived: false },
      { $set: { isArchived: true } }
    );
    
    if (result.modifiedCount > 0) {
      console.log(`Successfully archived ${result.modifiedCount} past showtimes at ${currentDate.toISOString()}`);
    } else {
      console.log(`No showtimes were archived. Found ${showtimesToArchive.length} candidates but no updates made.`);
      
      // Check if there's a date format issue
      if (showtimesToArchive.length > 0) {
        const sample = showtimesToArchive[0];
        console.log('Sample showtime that should be archived:', {
          id: sample._id,
          endTime: sample.endTime,
          endTimeType: typeof sample.endTime,
          currentTime: currentDate,
          comparison: sample.endTime < currentDate ? 'should be archived' : 'should not be archived',
          timeDiff: (currentDate - sample.endTime) / (1000 * 60) + ' minutes'
        });
      }
    }
    
    // If we've archived showtimes, check if we need to generate next day's showtimes
    if (result.modifiedCount > 0) {
      // Get tomorrow's date
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      // Check if we already have showtimes for tomorrow
      const tomorrowShowtimes = await Showtime.find({
        date: {
          $gte: tomorrow,
          $lt: new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000)
        }
      });
      
      // If no showtimes for tomorrow, generate them
      if (tomorrowShowtimes.length === 0) {
        console.log('No showtimes found for tomorrow. Generating new showtimes...');
        const generatedCount = await generateNextDayShowtimes();
        console.log(`Generated ${generatedCount} showtimes for tomorrow.`);
      } else {
        console.log(`Found ${tomorrowShowtimes.length} showtimes already scheduled for tomorrow.`);
      }
    }
    
    return result.modifiedCount;
  } catch (error) {
    console.error('Error archiving past showtimes:', error);
    throw error;
  }
};

// Update a showtime by ID
export const updateShowtime = async (req, res) => {
  try {
    const { id } = req.params;
    const { movieId, screen, startTime, endTime, date, cutoffMinutes } = req.body;

    // Check if the showtime exists
    const showtime = await Showtime.findById(id);
    if (!showtime) {
      return res.status(404).json({ message: 'Showtime not found' });
    }

    // Check if the movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Update the showtime
    const updatedShowtime = await Showtime.findByIdAndUpdate(
      id,
      {
        movieId,
        screen,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        date: new Date(date),
        cutoffMinutes: cutoffMinutes || 15
      },
      { new: true }
    );

    res.status(200).json(updatedShowtime);
  } catch (error) {
    console.error('Error updating showtime:', error);
    res.status(500).json({ message: 'Error updating showtime', error: error.message });
  }
};

// Delete a showtime by ID
export const deleteShowtime = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the showtime exists
    const showtime = await Showtime.findById(id);
    if (!showtime) {
      return res.status(404).json({ message: 'Showtime not found' });
    }

    // Delete associated seats
    await Seat.deleteMany({ showtimeId: id });
    
    // Delete associated parking slots
    await ParkingSlot.deleteMany({ showtimeId: id });
    
    // Delete the showtime
    await Showtime.findByIdAndDelete(id);

    res.status(200).json({ message: 'Showtime deleted successfully' });
  } catch (error) {
    console.error('Error deleting showtime:', error);
    res.status(500).json({ message: 'Error deleting showtime', error: error.message });
  }
};

// Reopen all archived showtimes for the new day
export const reopenAllShowtimes = async () => {
  try {
    console.log('Starting to reopen all archived showtimes...');
    
    // Get current date
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    // Find all archived showtimes
    const archivedShowtimes = await Showtime.find({ isArchived: true });
    
    if (archivedShowtimes.length === 0) {
      console.log('No archived showtimes found to reopen.');
      return 0;
    }
    
    console.log(`Found ${archivedShowtimes.length} archived showtimes. Reopening all...`);
    
    // Reopen all archived showtimes by setting isArchived to false
    const result = await Showtime.updateMany(
      { isArchived: true },
      { $set: { isArchived: false } }
    );
    
    console.log(`Successfully reopened ${result.modifiedCount} showtimes at ${currentDate.toISOString()}`);
    return result.modifiedCount;
  } catch (error) {
    console.error('Error reopening archived showtimes:', error);
    throw error;
  }
};

// Generate showtimes for the next day
export const generateNextDayShowtimes = async () => {
  try {
    console.log('Generating showtimes for next day...');
    
    // Get all active movies
    const movies = await Movie.find();
    console.log(`Found ${movies.length} active movies`);
    
    if (movies.length === 0) {
      console.log('No movies found. Cannot generate showtimes.');
      return 0;
    }
    
    // Calculate the date for tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    console.log(`Generating showtimes for date: ${tomorrow.toISOString()}`);
    
    // Check if showtimes already exist for tomorrow
    const existingShowtimes = await Showtime.find({
      date: {
        $gte: tomorrow,
        $lt: new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000)
      }
    });
    
    if (existingShowtimes.length > 0) {
      console.log(`Found ${existingShowtimes.length} showtimes already existing for tomorrow. Skipping generation.`);
      return existingShowtimes.length; // Return existing count
    }
    
    // Different show timings for each screen - multiple timings per screen per day
    const screenTimings = [
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
    
    // Track the number of new showtimes created
    let newShowtimesCount = 0;
    
    // For each movie, assign to multiple screens with different timings
    for (let i = 0; i < movies.length; i++) {
      const movie = movies[i];
      
      // Each movie gets one showtime, rotating through available slots
      const timingIndex = i % screenTimings.length;
      const assignedTiming = screenTimings[timingIndex];
      
      const [startHour, startMinute] = assignedTiming.start.split(':').map(Number);
      const [endHour, endMinute] = assignedTiming.end.split(':').map(Number);
      
      // Create start time for tomorrow
      const startTime = new Date(tomorrow);
      startTime.setHours(startHour, startMinute, 0, 0);
      
      // Create end time for tomorrow  
      const endTime = new Date(tomorrow);
      endTime.setHours(endHour, endMinute, 0, 0);
      
      // Ensure we're working with the correct year
      if (startTime.getFullYear() !== tomorrow.getFullYear()) {
        startTime.setFullYear(tomorrow.getFullYear());
      }
      if (endTime.getFullYear() !== tomorrow.getFullYear()) {
        endTime.setFullYear(tomorrow.getFullYear());
      }
      
      console.log(`Creating showtime for ${movie.name}: ${startTime.toISOString()} - ${endTime.toISOString()}`);
      
      // Check if this exact showtime already exists
      const existingShowtime = await Showtime.findOne({
        movieId: movie._id,
        screen: assignedTiming.screen,
        date: tomorrow,
        startTime: startTime
      });
      
      if (!existingShowtime) {
        const newShowtime = await new Showtime({
          movieId: movie._id,
          screen: assignedTiming.screen,
          startTime,
          endTime,
          date: tomorrow,
          cutoffMinutes: assignedTiming.cutoff,
          isArchived: false
        }).save();
        
        console.log(`Created new showtime: ${newShowtime._id} for ${movie.name}`);
        
        // Create seats for this showtime
        await createSeatsForShowtime(movie._id, newShowtime._id);
        
        // Create parking slots for this showtime
        await createParkingForShowtime(movie._id, newShowtime._id);
        
        newShowtimesCount++;
        console.log(`Generated showtime for ${movie.name} in ${assignedTiming.screen} at ${assignedTiming.start}-${assignedTiming.end}`);
      } else {
        console.log(`Showtime already exists for ${movie.name} in ${assignedTiming.screen} at ${assignedTiming.start}`);
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

// Force archive all past showtimes regardless of their current status
export const forceArchivePastShowtimes = async (req, res) => {
  try {
    const currentDate = new Date();
    console.log(`Force archiving all past showtimes at ${currentDate.toISOString()}`);
    
    // Find all showtimes that should be archived
    const showtimesToArchive = await Showtime.find({
      endTime: { $lt: currentDate }
    });
    
    console.log(`Found ${showtimesToArchive.length} total past showtimes`);
    
    // Archive all showtimes that have ended
    const result = await Showtime.updateMany(
      { endTime: { $lt: currentDate } },
      { $set: { isArchived: true } }
    );
    
    console.log(`Force archived ${result.modifiedCount} past showtimes`);
    
    // Check if we need to generate next day's showtimes
    // Get tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    // Check if we already have showtimes for tomorrow
    const tomorrowShowtimes = await Showtime.find({
      date: {
        $gte: tomorrow,
        $lt: new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000)
      }
    });
    
    let nextDayShowtimesCount = 0;
    
    // If no showtimes for tomorrow, generate them
    if (tomorrowShowtimes.length === 0) {
      console.log('No showtimes found for tomorrow. Generating new showtimes...');
      nextDayShowtimesCount = await generateNextDayShowtimes();
      console.log(`Generated ${nextDayShowtimesCount} showtimes for tomorrow.`);
    } else {
      console.log(`Found ${tomorrowShowtimes.length} showtimes already scheduled for tomorrow.`);
    }
    
    // Also return detailed information for debugging
    const archivedShowtimes = await Showtime.find({
      endTime: { $lt: currentDate },
      isArchived: true
    }).populate('movieId', 'name');
    
    res.status(200).json({
      message: `Successfully archived ${result.modifiedCount} past showtimes`,
      modifiedCount: result.modifiedCount,
      totalPastShowtimes: showtimesToArchive.length,
      totalArchivedNow: archivedShowtimes.length,
      nextDayShowtimesGenerated: nextDayShowtimesCount,
      sample: archivedShowtimes.slice(0, 5).map(st => ({
        id: st._id,
        movieName: st.movieId?.name || 'Unknown movie',
        screen: st.screen,
        startTime: st.startTime,
        endTime: st.endTime,
        isArchived: st.isArchived
      }))
    });
  } catch (error) {
    console.error('Error force archiving past showtimes:', error);
    res.status(500).json({ message: 'Error archiving showtimes', error: error.message });
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
  
  // Bulk insert seats
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
  console.log(`Created ${seats.length} seats for showtime ${showtimeId}`);
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
  console.log(`Created ${parkingSlots.length} parking slots for showtime ${showtimeId}`);
};
