import express from 'express';
import Movie from '../models/movie.model.js'; // Import the Movie model

const router = express.Router();

// Get all movies
router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find();
    res.status(200).json(movies);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch movies', error: err });
  }
});

// Add a new movie
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
    res.status(500).json({ message: 'Failed to add movie', error: err });
  }
});

export default router;
