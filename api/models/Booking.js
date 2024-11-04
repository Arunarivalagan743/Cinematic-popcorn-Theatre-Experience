const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  movie: { type: String, required: true },
  screen: { type: String, required: true },
  timing: { type: String, required: true },
  seats: {
    type: [Number],  // Array of seat numbers
    required: true,
  },
  totalCost: { type: Number, required: true },
  parkingDetails: {
    type: {
      parkingType: String,
      phone: String,
      vehicleNumber: String,
    },
    default: null,
  },
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
