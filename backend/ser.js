
require('dotenv').config();
console.log("Mongo URI:", process.env.MONGO_URI);  // Verify that this outputs the MongoDB URI

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 6000; // Ensure your server runs on port 3000

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://arunarivalagan774:arunhari27@movie-mern.iuov1.mongodb.net/?retryWrites=true&w=majority&appName=movie-mern', {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Define schema and model for ticket booking
const bookingSchema = new mongoose.Schema({
  movie: { type: String, required: true },
  screen: { type: String, required: true },
  timing: { type: String, required: true },
  seats: {  // This is where the seat numbers will be saved
    type: [String],  // Change to String to store seat numbers like 'A1', 'A2', etc.
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

// Test endpoint
app.get('/test', (req, res) => {
  res.send('Test endpoint is working');
});

// Booking endpoint
app.post('/api/checking', async (req, res) => {
  const { movie, screen, timing, seats, totalCost, parkingDetails } = req.body;

  console.log('Request data:', req.body); // Log incoming request data

  try {
    const booking = new Booking({
      movie,
      screen,
      timing,
      seats,
      totalCost,
      parkingDetails,
    });

    const savedBooking = await booking.save();
    res.status(201).json({ success: true, message: 'Booking saved successfully', booking: savedBooking });
  } catch (error) {
    console.error('Error saving booking:', error);
    res.status(500).json({ success: false, message: 'Failed to save booking', error: error.message });
  }
});


// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});