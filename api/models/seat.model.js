import mongoose from 'mongoose';

// Define constants for seat status
export const SeatStatus = {
  AVAILABLE: 'AVAILABLE',
  HELD: 'HELD',
  SOLD: 'SOLD'
};

const seatSchema = new mongoose.Schema({
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true
  },
  showtimeId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  seatNumber: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Gold', 'Platinum', 'Silver', 'Diamond', 'Balcony'],
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: [SeatStatus.AVAILABLE, SeatStatus.HELD, SeatStatus.SOLD],
    default: SeatStatus.AVAILABLE
  },
  holdUntil: {
    type: Date,
    default: null
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, { timestamps: true });

// Compound index to ensure unique seats per showtime
seatSchema.index({ showtimeId: 1, seatNumber: 1 }, { unique: true });

const Seat = mongoose.model('Seat', seatSchema);

export default Seat;
