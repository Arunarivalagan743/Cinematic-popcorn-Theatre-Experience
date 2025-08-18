const mongoose = require('mongoose');
const Seat = require('./api/models/seat.model');

// MongoDB connection
const mongoURI = process.env.NODE_ENV === 'production' 
  ? process.env.MONGO_URI 
  : 'mongodb://localhost:27017/mern-auth';

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
