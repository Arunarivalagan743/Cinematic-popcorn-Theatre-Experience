const mongoose = require('mongoose');

async function fixShowtimeSeatsWithObjectId() {
  try {
    await mongoose.connect('mongodb+srv://arunarivalagan774:arunhari27@movie-mern.iuov1.mongodb.net/?retryWrites=true&w=majority&appName=movie-mern');
    console.log('Connected to MongoDB');
    
    const showtimeId = new mongoose.Types.ObjectId('68a272eb595b68d501115498');
    console.log(`Fixing seats for showtime: ${showtimeId}`);
    
    // Check current state
    const currentSeats = await mongoose.connection.db.collection('seats').find({
      showtimeId: showtimeId
    }).toArray();
    
    console.log(`Found ${currentSeats.length} seats for this showtime`);
    
    // Check current categories
    const currentCategories = await mongoose.connection.db.collection('seats').aggregate([
      { $match: { showtimeId: showtimeId } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]).toArray();
    console.log('Current categories:', currentCategories);
    
    // Sample current seats
    const sampleA = await mongoose.connection.db.collection('seats').findOne({ 
      showtimeId: showtimeId, 
      seatNumber: 'A1' 
    });
    const sampleF = await mongoose.connection.db.collection('seats').findOne({ 
      showtimeId: showtimeId, 
      seatNumber: 'F1' 
    });
    const sampleJ = await mongoose.connection.db.collection('seats').findOne({ 
      showtimeId: showtimeId, 
      seatNumber: 'J7' 
    });
    const sampleK = await mongoose.connection.db.collection('seats').findOne({ 
      showtimeId: showtimeId, 
      seatNumber: 'K1' 
    });
    
    console.log('\nCurrent state:');
    console.log('A1:', sampleA ? { category: sampleA.category, price: sampleA.price } : 'Not found');
    console.log('F1:', sampleF ? { category: sampleF.category, price: sampleF.price } : 'Not found');
    console.log('J7:', sampleJ ? { category: sampleJ.category, price: sampleJ.price } : 'Not found');
    console.log('K1:', sampleK ? { category: sampleK.category, price: sampleK.price } : 'Not found');
    
    console.log('\nUpdating seat categories...');
    
    // Update STANDARD seats (A-E)
    const standardResult = await mongoose.connection.db.collection('seats').updateMany(
      { 
        showtimeId: showtimeId,
        seatNumber: { $regex: '^[ABCDE]' }
      },
      { $set: { category: 'STANDARD', price: 150 } }
    );
    console.log(`Updated ${standardResult.modifiedCount} STANDARD seats (A-E)`);
    
    // Update PREMIUM seats (F-J)
    const premiumResult = await mongoose.connection.db.collection('seats').updateMany(
      { 
        showtimeId: showtimeId,
        seatNumber: { $regex: '^[FGHIJ]' }
      },
      { $set: { category: 'PREMIUM', price: 180 } }
    );
    console.log(`Updated ${premiumResult.modifiedCount} PREMIUM seats (F-J)`);
    
    // Update VIP seats (K-O)
    const vipResult = await mongoose.connection.db.collection('seats').updateMany(
      { 
        showtimeId: showtimeId,
        seatNumber: { $regex: '^[KLMNO]' }
      },
      { $set: { category: 'VIP', price: 250 } }
    );
    console.log(`Updated ${vipResult.modifiedCount} VIP seats (K-O)`);
    
    // Verify the changes
    console.log('\n=== VERIFICATION ===');
    const newCategories = await mongoose.connection.db.collection('seats').aggregate([
      { $match: { showtimeId: showtimeId } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]).toArray();
    console.log('Updated categories:', newCategories);
    
    // Re-check samples
    const newSampleA = await mongoose.connection.db.collection('seats').findOne({ 
      showtimeId: showtimeId, 
      seatNumber: 'A1' 
    });
    const newSampleF = await mongoose.connection.db.collection('seats').findOne({ 
      showtimeId: showtimeId, 
      seatNumber: 'F1' 
    });
    const newSampleJ = await mongoose.connection.db.collection('seats').findOne({ 
      showtimeId: showtimeId, 
      seatNumber: 'J7' 
    });
    const newSampleK = await mongoose.connection.db.collection('seats').findOne({ 
      showtimeId: showtimeId, 
      seatNumber: 'K1' 
    });
    
    console.log('\nUpdated samples:');
    console.log('A1 (STANDARD):', { category: newSampleA.category, price: newSampleA.price });
    console.log('F1 (PREMIUM):', { category: newSampleF.category, price: newSampleF.price });
    console.log('J7 (PREMIUM):', { category: newSampleJ.category, price: newSampleJ.price });
    console.log('K1 (VIP):', { category: newSampleK.category, price: newSampleK.price });
    
    console.log('\n✅ Seats updated successfully for this showtime!');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

fixShowtimeSeatsWithObjectId();
