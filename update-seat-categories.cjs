const mongoose = require('mongoose');

// Define the Seat schema (since we can't import from the models file)
const seatSchema = new mongoose.Schema({
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true,
  },
  showtimeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Showtime',
    required: true,
  },
  seatNumber: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['STANDARD', 'PREMIUM', 'VIP'],
    default: 'STANDARD',
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['AVAILABLE', 'HELD', 'SOLD'],
    default: 'AVAILABLE',
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  holdUntil: {
    type: Date,
    default: null,
  }
}, {
  timestamps: true,
});

const Seat = mongoose.model('Seat', seatSchema);

// MongoDB connection
const mongoURI = process.env.NODE_ENV === 'production' 
  ? process.env.MONGO_URI 
  : 'mongodb+srv://arunarivalagan774:arunhari27@movie-mern.iuov1.mongodb.net/?retryWrites=true&w=majority&appName=movie-mern';

async function updateSeatCategories() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB successfully!');

    // Get all seats
    const allSeats = await Seat.find({}).sort({ seatNumber: 1 });
    console.log(`Found ${allSeats.length} seats to update`);

    if (allSeats.length === 0) {
      console.log('No seats found in database');
      return;
    }

    let updatedCount = 0;

    // Update seats with new categories and prices
    for (let i = 0; i < allSeats.length; i++) {
      const seat = allSeats[i];
      let newCategory, newPrice;

      // Distribute seats across categories
      // Front rows (A-E): Standard
      // Middle rows (F-J): Premium  
      // Back rows (K-O): VIP
      const row = seat.seatNumber.charAt(0);
      
      if (['A', 'B', 'C', 'D', 'E'].includes(row)) {
        newCategory = 'STANDARD';
        newPrice = 150;
      } else if (['F', 'G', 'H', 'I', 'J'].includes(row)) {
        newCategory = 'PREMIUM';
        newPrice = 180;
      } else {
        // K, L, M, N, O rows
        newCategory = 'VIP';
        newPrice = 250;
      }

      // Update the seat
      await Seat.findByIdAndUpdate(seat._id, {
        category: newCategory,
        price: newPrice
      });

      updatedCount++;
      console.log(`Updated seat ${seat.seatNumber}: ${newCategory} (₹${newPrice})`);
    }

    console.log(`\n✅ Successfully updated ${updatedCount} seats!`);
    
    // Show summary
    const standardCount = await Seat.countDocuments({ category: 'STANDARD' });
    const premiumCount = await Seat.countDocuments({ category: 'PREMIUM' });
    const vipCount = await Seat.countDocuments({ category: 'VIP' });
    
    console.log('\n📊 Updated Seat Distribution:');
    console.log(`Standard (₹150): ${standardCount} seats (Rows A-E)`);
    console.log(`Premium (₹180): ${premiumCount} seats (Rows F-J)`);
    console.log(`VIP (₹250): ${vipCount} seats (Rows K-O)`);
    
  } catch (error) {
    console.error('Error updating seat categories:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');
  }
}

// Run the update
updateSeatCategories();
