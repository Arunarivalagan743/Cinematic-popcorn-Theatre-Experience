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
    const movies = await Movie.find();
    
    // For each movie, get its showtimes
    const moviesWithShowtimes = await Promise.all(movies.map(async (movie) => {
      const showtimes = await Showtime.find({ 
        movieId: movie._id,
        isArchived: false,
        startTime: { $gt: new Date() } // Only future showtimes
      }).sort({ date: 1, startTime: 1 });
      
      return {
        ...movie._doc,
        showtimes
      };
    }));
    
    res.status(200).json(moviesWithShowtimes);
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({ message: 'Failed to fetch movies', error: error.message });
  }
};
