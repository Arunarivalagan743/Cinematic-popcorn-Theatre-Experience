import mongoose from 'mongoose';

const showtimeSchema = new mongoose.Schema({
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true
  },
  screen: {
    type: String,
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  isArchived: {
    type: Boolean,
    default: false
  },
  cutoffMinutes: {
    type: Number,
    default: 15 // Default cutoff time before showtime starts
  }
}, { timestamps: true });

// Compound index to ensure no overlapping showtimes for the same screen
showtimeSchema.index({ screen: 1, startTime: 1, endTime: 1 }, { unique: true });

const Showtime = mongoose.model('Showtime', showtimeSchema);

export default Showtime;
