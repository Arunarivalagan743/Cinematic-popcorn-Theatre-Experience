const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const uri = 'mongodb+srv://arunarivalagan774:arunhari27@movie-mern.iuov1.mongodb.net/?retryWrites=true&w=majority&appName=movie-mern';
const client = new MongoClient(uri);

const bookingSchema = new mongoose.Schema({
  movie: String,
  screen: String,
  timing: String,
  seats: [Number],
  totalCost: Number,
  parkingDetails: {
    type: Object,
    default: null,
  },
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema, 'Bookings');

const connectDB = async () => {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

connectDB();

app.post('/add-movie', async (req, res) => {
  try {
    const database = client.db('Clusters');
    const collection = database.collection('movies');
    const movieDataArray = req.body;

    const result = await collection.insertMany(movieDataArray);
    res.status(201).send(`Movies added with IDs: ${result.insertedIds}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error adding movies');
  }
});

app.post('/api/booking', async (req, res) => {
  const { movie, screen, timing, seats, totalCost, parkingDetails } = req.body;

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
    res.status(201).json({ success: true, booking: savedBooking });
  } catch (error) {
    console.error('Error saving booking:', error);
    res.status(500).json({ success: false, message: 'Failed to save booking' });
  }
});

app.get('/movies', async (req, res) => {
  try {
    const database = client.db('Clusters');
    const collection = database.collection('movies');
    const movies = await collection.find({}).toArray();
    res.status(200).json(movies);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching movies');
  }
});

app.patch('/update-movie/:movieName', async (req, res) => {
  try {
    const database = client.db('Clusters');
    const collection = database.collection('movies');

    const movieName = req.params.movieName;
    const newImageUrl = req.body.imageUrl;

    const result = await collection.updateOne(
      { movieName: movieName },
      { $set: { imageUrl: newImageUrl } }
    );

    if (result.modifiedCount > 0) {
      res.send(`Image URL updated for movie: ${movieName}`);
    } else {
      res.send(`No movie found with name: ${movieName}`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating movie image URL');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
