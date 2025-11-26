import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: false,
  },
  year: {
    type: Number,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  language: {
    type: [String],
    required: true,
  },
  runtime: {
    type: String,
    required: false,
  },
  releaseDate: {
    type: String,
    required: true,
  },
  cast: {
    type: [String],
    required: true,
  },
  crew: {
    director: {
      type: String,
      required: true,
    },
    writer: {
      type: String,
      required: false,
    },
    producer: {
      type: [String],
      required: false,
    }
  },
  productionCompanies: {
    type: [String],
    required: false,
  },
  musicBy: {
    type: String,
    required: false,
  },
  cinematography: {
    type: String,
    required: false,
  },
  editing: {
    type: String,
    required: false,
  },
  budget: {
    type: String,
    required: false,
  },
  summary: {
    type: String,
    required: true,
  },
  poster: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String, 
    required: false,
  },
  status: {
    type: String,
    enum: ['Upcoming', 'Released', 'Coming Soon'],
    required: true,
  },
  ratings: {
    type: Number,
    required: false,
    default: 0,
  }, 
  votes: {
    type: Number,
    default: 0,
  },
  duration: {
    type: Number,
    required: false,
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
