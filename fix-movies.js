// Create a fix-movies.js script to update showtime references in movies
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Define schemas similar to the models in api/models
const movieSchema = new mongoose.Schema({
  name: String,
  genre: String,
  language: String,
  cast: String,
  screen: String,
  timing: String,
  ratings: { type: mongoose.Schema.Types.Mixed },
  votes: { type: mongoose.Schema.Types.Mixed },
  summary: String,
  imageUrl: String,
  showtimes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Showtime'
  }]
}, { timestamps: true, strict: false });

const showtimeSchema = new mongoose.Schema({
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie'
  },
  screen: String,
  startTime: Date,
  endTime: Date,
  isActive: {
    type: Boolean,
    default: true
  },
  seatsAvailable: {
    type: Number,
    default: 64
  }
}, { timestamps: true });

// Define models
const Movie = mongoose.model('Movie', movieSchema);
const Showtime = mongoose.model('Showtime', showtimeSchema);

async function createShowtimesIfNeeded() {
  try {
    // Connect to MongoDB
    const MONGO_URI = process.env.MONGO || 'mongodb+srv://arunarivalagan774:arunhari27@movie-mern.iuov1.mongodb.net/?retryWrites=true&w=majority&appName=movie-mern';
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
    
    // Get all movies
    const movies = await Movie.find();
    console.log(`Found ${movies.length} movies`);
    
    // Get all showtimes
    const showtimes = await Showtime.find();
    console.log(`Found ${showtimes.length} showtimes`);
    
    // Get the current date (only the date part, not time)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Create showtimes for movies that don't have any
    let createdCount = 0;
    let updatedCount = 0;
    
    for (const movie of movies) {
      // Check if movie has showtimes
      if (!movie.showtimes || movie.showtimes.length === 0) {
        console.log(`Creating new showtime for movie: ${movie.name}`);
        
        // Parse the timing string (format: "10:00 AM")
        let hour = 12;
        let minute = 0;
        
        if (movie.timing) {
          const timeParts = movie.timing.match(/(\d+):(\d+)\s*(AM|PM)?/i);
          if (timeParts) {
            hour = parseInt(timeParts[1]);
            minute = parseInt(timeParts[2]);
            const period = timeParts[3]?.toUpperCase();
            
            // Convert to 24-hour format if needed
            if (period === 'PM' && hour < 12) hour += 12;
            if (period === 'AM' && hour === 12) hour = 0;
          }
        }
        
        // Create start time at today's date with the movie's time
        const startTime = new Date(today);
        startTime.setHours(hour, minute);
        
        // Create end time (2 hours after start)
        const endTime = new Date(startTime);
        endTime.setHours(endTime.getHours() + 2);
        
        // Create new showtime
        const newShowtime = new Showtime({
          movieId: movie._id,
          screen: movie.screen || 'Screen 1',
          startTime,
          endTime,
          isActive: true,
          seatsAvailable: 64
        });
        
        const savedShowtime = await newShowtime.save();
        console.log(`Created showtime: ${savedShowtime._id} at ${startTime.toLocaleString()}`);
        
        // Update movie with showtime reference
        if (!movie.showtimes) movie.showtimes = [];
        movie.showtimes.push(savedShowtime._id);
        await movie.save();
        
        createdCount++;
      } else {
        // Make sure movie has showtimes properly populated
        if (!movie.showtimes[0]._id) {
          // If showtimes exist but aren't properly populated objects
          console.log(`Updating references for movie: ${movie.name}`);
          
          // Find showtimes for this movie
          const movieShowtimes = await Showtime.find({ movieId: movie._id });
          
          if (movieShowtimes.length > 0) {
            movie.showtimes = movieShowtimes.map(st => st._id);
            await movie.save();
            updatedCount++;
          } else {
            console.log(`No showtimes found for movie: ${movie.name}`);
          }
        } else {
          console.log(`Movie "${movie.name}" already has properly referenced showtimes`);
        }
      }
    }
    
    console.log(`Created ${createdCount} new showtimes and updated ${updatedCount} movie references`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the function
createShowtimesIfNeeded();
