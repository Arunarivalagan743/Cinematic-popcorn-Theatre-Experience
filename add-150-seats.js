import mongoose from 'mongoose';

// Seat Schema
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
    enum: ['AVAILABLE', 'HELD', 'SOLD'],
    default: 'AVAILABLE'
  }
}, { timestamps: true });

const Seat = mongoose.model('Seat', seatSchema);

// Showtime Schema
const showtimeSchema = new mongoose.Schema({
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true
  },
  screen: String,
  startTime: Date,
  date: Date
}, { timestamps: true });

const Showtime = mongoose.model('Showtime', showtimeSchema);

// Database connection
const DB_URL = 'mongodb+srv://arunarivalagan774:arunhari27@movie-mern.iuov1.mongodb.net/?retryWrites=true&w=majority&appName=movie-mern';

// Function to create 150 seats for a showtime
function create150Seats(showtimeId, movieId) {
  const seats = [];
  
  // 15 rows (A-O) with 10 seats each = 150 seats
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O'];
  
  rows.forEach(row => {
    for (let seatNum = 1; seatNum <= 10; seatNum++) {
      seats.push({
        movieId,
        showtimeId,
        seatNumber: `${row}${seatNum}`,
        category: 'Silver', // All seats same category
        price: 150, // All seats ₹150
        status: 'AVAILABLE'
      });
    }
  });
  
  return seats;
}

// Main function
async function generateSeatsForAllMovies() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(DB_URL);
    console.log('✅ Connected to MongoDB');
    
    // Get all showtimes
    const showtimes = await Showtime.find({});
    console.log(`📊 Found ${showtimes.length} showtimes`);
    
    let totalSeatsAdded = 0;
    
    for (const showtime of showtimes) {
      // Check if seats already exist
      const existingSeats = await Seat.countDocuments({ showtimeId: showtime._id });
      
      if (existingSeats >= 150) {
        console.log(`⏭️  Showtime ${showtime._id} already has ${existingSeats} seats`);
        continue;
      }
      
      // Delete existing seats if any
      if (existingSeats > 0) {
        await Seat.deleteMany({ showtimeId: showtime._id });
        console.log(`🗑️  Deleted ${existingSeats} existing seats`);
      }
      
      // Create 150 new seats
      const newSeats = create150Seats(showtime._id, showtime.movieId);
      await Seat.insertMany(newSeats);
      
      totalSeatsAdded += 150;
      console.log(`✅ Added 150 seats to showtime ${showtime._id}`);
    }
    
    console.log(`\n🎉 COMPLETED!`);
    console.log(`📈 Total seats added: ${totalSeatsAdded}`);
    console.log(`🎬 Showtimes processed: ${showtimes.length}`);
    console.log(`💺 Each movie now has 150 seats`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the script
generateSeatsForAllMovies();
