import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  cast: {
    type: String,
    required: true,
  },
  screen: {
    type: String,
    required: true,
  },
  timing: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String, // This could be a path or URL to an image
    required: true,
  },
  ratings: {
    type: Number,
    required: true,
  },
});

const Movie = mongoose.model('Movie', movieSchema);

export default Movie;
