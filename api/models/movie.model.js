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
  summary: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String, 
    required: true,
  },
  ratings: {
    type: Number,
    required: true,
  }, 
  votes: {
    type: String,
    default: 0, // Initialize likes to 0
  },
  duration: {
    type: Number,
    required: true,
    default: 120 // Duration in minutes
  },
  screen: {
    type: String,
    required: false
  },
  timing: {
    type: String,
    required: false
  },
  showtimes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Showtime'
  }]
}, { timestamps: true });

const Movie = mongoose.model('Movie', movieSchema);

export default Movie;
