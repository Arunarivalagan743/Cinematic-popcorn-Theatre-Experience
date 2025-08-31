import Movie from '../models/movie.model.js';
import Showtime from '../models/showtime.model.js';

// Controller to handle POST request to create a movie
export const createMovie = async (req, res) => {
  try {
    const { name, genre, language, cast, summary, imageUrl, ratings, votes, duration } = req.body;
    
    // Create a new movie object
    const newMovie = new Movie({
      name,
      genre,
      language,
      cast,
      summary,
      imageUrl,
      ratings,
      votes,
      duration: duration || 120 // Default to 120 minutes if not provided
    });

    // Save the new movie to the database
    await newMovie.save();
    res.status(201).json(newMovie); // Return the created movie

  } catch (error) {
    console.error('Error creating movie:', error);
    res.status(500).json({ message: 'Failed to insert movie', error: error.message });
  }
};

// Get all movies with their showtimes
export const getAllMovies = async (req, res) => {
  try {
    console.log("getAllMovies called at", new Date().toISOString());
    
    // Force check for ended showtimes first
    const currentTime = new Date();
    
    // Directly update any past showtimes to be archived
    const archiveResult = await Showtime.updateMany(
      { endTime: { $lt: currentTime }, isArchived: false },
      { $set: { isArchived: true } }
    );
    
    if (archiveResult.modifiedCount > 0) {
      console.log(`getAllMovies automatically archived ${archiveResult.modifiedCount} past showtimes`);
    }
    
    const movies = await Movie.find();
    
    // For each movie, get its showtimes
    const moviesWithShowtimes = await Promise.all(movies.map(async (movie) => {
      // Get all non-archived showtimes
      const allShowtimes = await Showtime.find({ 
        movieId: movie._id,
        isArchived: false
      }).sort({ date: 1, startTime: 1 });
      
      // Process and filter showtimes
      const validShowtimes = allShowtimes.filter(showtime => {
        // Skip archived showtimes completely
        if (showtime.isArchived) {
          return false;
        }
        
        const showtimeStart = new Date(showtime.startTime);
        const showtimeEnd = new Date(showtime.endTime);
        const cutoffTime = new Date(showtimeStart.getTime() - (showtime.cutoffMinutes * 60000));
        
        // Log detailed information about each showtime for debugging
        const isAfterEnd = currentTime > showtimeEnd;
        const isAfterStart = currentTime > showtimeStart;
        const isAfterCutoff = currentTime > cutoffTime;
        
        console.log(`Showtime ${showtime._id} check:`, {
          movieName: movie.name,
          screen: showtime.screen,
          startTime: showtimeStart.toLocaleString(),
          endTime: showtimeEnd.toLocaleString(),
          cutoffTime: cutoffTime.toLocaleString(),
          currentTime: currentTime.toLocaleString(),
          isAfterCutoff,
          isAfterStart,
          isAfterEnd,
          isArchived: showtime.isArchived,
          shouldShow: !isAfterEnd && !isAfterStart && !isAfterCutoff
        });
        
        // If the showtime has already ended, it should have been archived
        // If not archived, manually update it now (this is a safeguard)
        if (isAfterEnd && !showtime.isArchived) {
          console.log(`WARNING: Showtime ${showtime._id} has ended but is not archived. Archiving now.`);
          // Update in database (async, don't wait)
          Showtime.updateOne({ _id: showtime._id }, { $set: { isArchived: true } })
            .then(() => console.log(`Showtime ${showtime._id} has been archived`))
            .catch(err => console.error(`Error archiving showtime ${showtime._id}:`, err));
          
          // Don't include this showtime in the results
          return false;
        }
        
        // Only include showtimes that:
        // 1. Are not archived
        // 2. Have not ended
        // 3. Have not started
        // 4. Are still within the booking window (cutoff time)
        return !showtime.isArchived && !isAfterEnd && !isAfterStart && !isAfterCutoff;
      });
      
      return {
        ...movie._doc,
        showtimes: validShowtimes
      };
    }));
    
    console.log(`Returning ${moviesWithShowtimes.length} movies with valid showtimes`);
    res.status(200).json(moviesWithShowtimes);
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({ message: 'Failed to fetch movies', error: error.message });
  }
};
