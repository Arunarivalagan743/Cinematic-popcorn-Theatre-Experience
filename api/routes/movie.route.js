import express from 'express';
import Movie from '../models/movie.model.js';  // Movie schema
import Showtime from '../models/showtime.model.js';  // Add Showtime model
import mongoose from 'mongoose'; // For ObjectId validation

const router = express.Router();

// GET route to fetch all movies
router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find();  // Fetch all movies
    
    // For each movie, get its showtimes separately
    const moviesWithShowtimes = await Promise.all(movies.map(async (movie) => {
      const showtimes = await Showtime.find({ movieId: movie._id }).sort({ startTime: 1 });
      const movieObj = movie.toObject();
      movieObj.showtimes = showtimes;
      return movieObj;
    }));
    
    res.status(200).json(moviesWithShowtimes);  // Sending the movies data with showtimes
  } catch (err) {
    console.error('Error fetching movies:', err);
    res.status(500).json({ message: 'Failed to fetch movies', error: err.message });
  }
});

// GET route to fetch a movie by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate if id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid movie ID format' });
    }
    
    // Get the movie
    let movie = await Movie.findById(id);
    
    if (!movie) {
      return res.status(404).json({ 
        message: 'Movie not found', 
        error: 'The requested movie does not exist in our database'
      });
    }
    
    // Get showtimes for this movie
    const showtimes = await Showtime.find({ movieId: movie._id }).sort({ startTime: 1 });
    const movieObj = movie.toObject();
    movieObj.showtimes = showtimes;
    
    // If no showtimes were found, try to find them by screen
    if ((!showtimes || showtimes.length === 0) && movie.name && movie.screen) {
      const additionalShowtimes = await Showtime.find({ 
        $or: [
          { movieId: movie._id },
          { screen: movie.screen }
        ]
      });
      
      if (additionalShowtimes.length > 0) {
        movie.showtimes = additionalShowtimes;
        await movie.save();
      }
    }
    
    res.status(200).json(movie);
  } catch (err) {
    console.error('Error fetching movie by ID:', err);
    res.status(500).json({ message: 'Failed to fetch movie', error: err.message });
  }
});

// POST route to add a new movie
router.post('/', async (req, res) => {
  const { name, genre, language, cast, screen, timing, summary, imageUrl, ratings,votes } = req.body;

  try {
    const newMovie = new Movie({
      name,
      genre,
      language,
      cast,
      screen,
      timing,
      summary,
      imageUrl,
      ratings,
      votes,
    });
    await newMovie.save();
    res.status(201).json({ message: 'Movie added successfully', movie: newMovie });
  } catch (err) {
    console.error('Error adding movie:', err);
    res.status(500).json({ message: 'Failed to add movie', error: err });
  }
});

export default router;
