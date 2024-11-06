// models/Booking.js
import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  movie: { type: String, required: true },
  screen: { type: String, required: true },
  timing: { type: String, required: true },
  seats: [String], // Array of seat labels (e.g., 'A1', 'B3')
  totalCost: { type: Number, required: true },
  email: { type: String, required: true },
  parkingDetails: {
    parkingType: { type: String },
    phone: { type: String },
    vehicleNumber: { type: String },
  },
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
