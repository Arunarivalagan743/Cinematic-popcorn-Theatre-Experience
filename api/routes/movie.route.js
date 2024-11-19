import express from 'express';
import Movie from '../models/movie.model.js';  // Movie schema

const router = express.Router();

// GET route to fetch all movies
// GET route to fetch all movies
router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find();  // Fetch all movies from MongoDB
    res.status(200).json(movies);  // Sending the movies data as a response
  } catch (err) {
    console.error('Error fetching movies:', err);
    res.status(500).json({ message: 'Failed to fetch movies', error: err });
  }
});

// POST route to add a new movie
router.post('/', async (req, res) => {
  const { name, genre, language, cast, screen, timing, summary, imageUrl, ratings } = req.body;

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
    });
    await newMovie.save();
    res.status(201).json({ message: 'Movie added successfully', movie: newMovie });
  } catch (err) {
    console.error('Error adding movie:', err);
    res.status(500).json({ message: 'Failed to add movie', error: err });
  }
});

export default router;
