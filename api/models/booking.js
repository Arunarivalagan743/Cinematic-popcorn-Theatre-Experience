import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  movieId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Movie', 
    required: true 
  },
  showtimeId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  seats: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Seat' 
  }],
  seatIds: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Seat' 
  }],
  parkingSlots: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'ParkingSlot' 
  }],
  parkingSlotIds: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'ParkingSlot' 
  }],
  totalCost: { 
    type: Number, 
    required: true 
  },
  paymentStatus: { 
    type: String, 
    enum: ['PENDING', 'COMPLETED', 'FAILED', 'pending', 'completed', 'failed'], 
    default: 'PENDING' 
  },
  paymentId: { 
    type: String, 
    default: null 
  },
  // Stripe Payment Intent ID
  paymentIntentId: {
    type: String,
    default: null
  },
  orderId: {
    type: String,
    default: null
  },
  paymentSignature: {
    type: String,
    default: null
  },
  paymentMethod: {
    type: String,
    enum: ['razorpay', 'stripe', 'cash', 'demo'],
    default: 'demo'
  },
  phone: { 
    type: String, 
    required: false 
  },
  bookingReference: {
    type: String,
    default: function() {
      // Generate unique booking reference using current timestamp and random number
      return Math.random().toString(36).substring(2, 8).toUpperCase() + 
             Date.now().toString(36).substring(4);
    }
  }
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
