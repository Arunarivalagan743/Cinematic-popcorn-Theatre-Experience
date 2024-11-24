import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  movie: { type: String, required: true },
  screen: { type: String, required: true },
  timing: { type: String, required: true },
  seats: { type: [String], required: true },
  totalCost: { type: Number, required: true },
  parkingDetails: {
    phone: { type: String, required: false },
    vehicleNumbers: {
      twoWheeler: [String],
      fourWheeler: [String],
    },
    parkingCost: { type: Number, required: false },
  },
  currentUser: { type: String, required: false },  // Store the email associated with the user
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
