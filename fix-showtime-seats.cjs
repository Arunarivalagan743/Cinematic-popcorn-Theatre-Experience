const mongoose = require('mongoose');

async function fixSpecificShowtimeSeats() {
  try {
    await mongoose.connect('mongodb+srv://arunarivalagan774:arunhari27@movie-mern.iuov1.mongodb.net/?retryWrites=true&w=majority&appName=movie-mern');
    console.log('Connected to MongoDB');
    
    const showtimeId = '68a272eb595b68d501115498';
    console.log(`Checking seats for showtime: ${showtimeId}`);
    
    // Check current state for this showtime
    const allSeatsForShowtime = await mongoose.connection.db.collection('seats').find({
      showtimeId: showtimeId
    }).toArray();
    
    console.log(`Total seats for this showtime: ${allSeatsForShowtime.length}`);
    
    // Check category distribution for this showtime
    const categoryStats = await mongoose.connection.db.collection('seats').aggregate([
      { $match: { showtimeId: showtimeId } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]).toArray();
    console.log('Current category distribution for this showtime:', categoryStats);
    
    // Check sample seats
    const sampleA = await mongoose.connection.db.collection('seats').findOne({ 
      showtimeId: showtimeId, 
      seatNumber: 'A1' 
    });
    const sampleF = await mongoose.connection.db.collection('seats').findOne({ 
      showtimeId: showtimeId, 
      seatNumber: 'F1' 
    });
    const sampleK = await mongoose.connection.db.collection('seats').findOne({ 
      showtimeId: showtimeId, 
      seatNumber: 'K1' 
    });
    const sampleJ = await mongoose.connection.db.collection('seats').findOne({ 
      showtimeId: showtimeId, 
      seatNumber: 'J7' 
    });
    
    console.log('\nCurrent state samples:');
    console.log('A1:', sampleA ? { category: sampleA.category, price: sampleA.price } : 'Not found');
    console.log('F1:', sampleF ? { category: sampleF.category, price: sampleF.price } : 'Not found');
    console.log('K1:', sampleK ? { category: sampleK.category, price: sampleK.price } : 'Not found');
    console.log('J7:', sampleJ ? { category: sampleJ.category, price: sampleJ.price } : 'Not found');
    
    console.log('\nFixing seats for this specific showtime...');
    
    // Fix STANDARD seats (A-E) for this showtime
    const standardResult = await mongoose.connection.db.collection('seats').updateMany(
      { 
        showtimeId: showtimeId,
        seatNumber: { $regex: '^[ABCDE]' }
      },
      { $set: { category: 'STANDARD', price: 150 } }
    );
    console.log(`Updated ${standardResult.modifiedCount} STANDARD seats`);
    
    // Fix PREMIUM seats (F-J) for this showtime
    const premiumResult = await mongoose.connection.db.collection('seats').updateMany(
      { 
        showtimeId: showtimeId,
        seatNumber: { $regex: '^[FGHIJ]' }
      },
      { $set: { category: 'PREMIUM', price: 180 } }
    );
    console.log(`Updated ${premiumResult.modifiedCount} PREMIUM seats`);
    
    // Fix VIP seats (K-O) for this showtime
    const vipResult = await mongoose.connection.db.collection('seats').updateMany(
      { 
        showtimeId: showtimeId,
        seatNumber: { $regex: '^[KLMNO]' }
      },
      { $set: { category: 'VIP', price: 250 } }
    );
    console.log(`Updated ${vipResult.modifiedCount} VIP seats`);
    
    // Verify the fix
    console.log('\n=== VERIFICATION FOR THIS SHOWTIME ===');
    const newCategoryStats = await mongoose.connection.db.collection('seats').aggregate([
      { $match: { showtimeId: showtimeId } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]).toArray();
    console.log('New category distribution:', newCategoryStats);
    
    // Re-check samples
    const newSampleA = await mongoose.connection.db.collection('seats').findOne({ 
      showtimeId: showtimeId, 
      seatNumber: 'A1' 
    });
    const newSampleF = await mongoose.connection.db.collection('seats').findOne({ 
      showtimeId: showtimeId, 
      seatNumber: 'F1' 
    });
    const newSampleK = await mongoose.connection.db.collection('seats').findOne({ 
      showtimeId: showtimeId, 
      seatNumber: 'K1' 
    });
    const newSampleJ = await mongoose.connection.db.collection('seats').findOne({ 
      showtimeId: showtimeId, 
      seatNumber: 'J7' 
    });
    
    console.log('\nFixed samples:');
    console.log('A1 (STANDARD):', { category: newSampleA.category, price: newSampleA.price });
    console.log('F1 (PREMIUM):', { category: newSampleF.category, price: newSampleF.price });
    console.log('K1 (VIP):', { category: newSampleK.category, price: newSampleK.price });
    console.log('J7 (PREMIUM):', { category: newSampleJ.category, price: newSampleJ.price });
    
    console.log('\n✅ Seats fixed for this specific showtime!');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

fixSpecificShowtimeSeats();
