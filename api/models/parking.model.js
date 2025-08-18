import mongoose from 'mongoose';

// Define constants for parking status
export const ParkingStatus = {
  AVAILABLE: 'AVAILABLE',
  HELD: 'HELD',
  SOLD: 'SOLD'
};

const parkingSchema = new mongoose.Schema({
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true
  },
  showtimeId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  slotNumber: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['twoWheeler', 'fourWheeler'],
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: [ParkingStatus.AVAILABLE, ParkingStatus.HELD, ParkingStatus.SOLD],
    default: ParkingStatus.AVAILABLE
  },
  holdUntil: {
    type: Date,
    default: null
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  vehicleNumber: {
    type: String,
    default: null
  }
}, { timestamps: true });

// Compound index to ensure unique parking slots per showtime
parkingSchema.index({ showtimeId: 1, slotNumber: 1 }, { unique: true });

const ParkingSlot = mongoose.model('ParkingSlot', parkingSchema);

export default ParkingSlot;
