const mongoose = require('mongoose');

async function fixAllSeatCategories() {
  try {
    await mongoose.connect('mongodb+srv://arunarivalagan774:arunhari27@movie-mern.iuov1.mongodb.net/?retryWrites=true&w=majority&appName=movie-mern');
    console.log('Connected to MongoDB');
    
    // First, let's see the current state
    console.log('Current state check...');
    const mismatchedSeats = await mongoose.connection.db.collection('seats').find({
      $or: [
        { seatNumber: { $regex: '^[ABCDE]' }, category: { $ne: 'STANDARD' } },
        { seatNumber: { $regex: '^[FGHIJ]' }, category: { $ne: 'PREMIUM' } },
        { seatNumber: { $regex: '^[KLMNO]' }, category: { $ne: 'VIP' } }
      ]
    }).limit(10).toArray();
    
    console.log('Mismatched seats found:', mismatchedSeats.length);
    if (mismatchedSeats.length > 0) {
      console.log('Sample mismatched seats:', mismatchedSeats.map(s => ({ 
        seatNumber: s.seatNumber, 
        category: s.category, 
        price: s.price 
      })));
    }
    
    console.log('\nFixing all seat categories...');
    
    // Fix STANDARD seats (A-E) - rows A, B, C, D, E
    console.log('Updating STANDARD seats (A-E)...');
    const standardSeats = await mongoose.connection.db.collection('seats').find({
      seatNumber: { $regex: '^[ABCDE]' }
    }).toArray();
    console.log(`Found ${standardSeats.length} seats in rows A-E`);
    
    const standardResult = await mongoose.connection.db.collection('seats').updateMany(
      { seatNumber: { $regex: '^[ABCDE]' } },
      { $set: { category: 'STANDARD', price: 150 } }
    );
    console.log(`Updated ${standardResult.modifiedCount} STANDARD seats`);
    
    // Fix PREMIUM seats (F-J) - rows F, G, H, I, J
    console.log('Updating PREMIUM seats (F-J)...');
    const premiumSeats = await mongoose.connection.db.collection('seats').find({
      seatNumber: { $regex: '^[FGHIJ]' }
    }).toArray();
    console.log(`Found ${premiumSeats.length} seats in rows F-J`);
    
    const premiumResult = await mongoose.connection.db.collection('seats').updateMany(
      { seatNumber: { $regex: '^[FGHIJ]' } },
      { $set: { category: 'PREMIUM', price: 180 } }
    );
    console.log(`Updated ${premiumResult.modifiedCount} PREMIUM seats`);
    
    // Fix VIP seats (K-O) - rows K, L, M, N, O
    console.log('Updating VIP seats (K-O)...');
    const vipSeats = await mongoose.connection.db.collection('seats').find({
      seatNumber: { $regex: '^[KLMNO]' }
    }).toArray();
    console.log(`Found ${vipSeats.length} seats in rows K-O`);
    
    const vipResult = await mongoose.connection.db.collection('seats').updateMany(
      { seatNumber: { $regex: '^[KLMNO]' } },
      { $set: { category: 'VIP', price: 250 } }
    );
    console.log(`Updated ${vipResult.modifiedCount} VIP seats`);
    
    // Final verification
    console.log('\n=== FINAL VERIFICATION ===');
    const finalCounts = await mongoose.connection.db.collection('seats').aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]).toArray();
    console.log('Final category distribution:', finalCounts);
    
    // Check samples from each category
    const sampleA = await mongoose.connection.db.collection('seats').findOne({ seatNumber: 'A1' });
    const sampleF = await mongoose.connection.db.collection('seats').findOne({ seatNumber: 'F1' });
    const sampleK = await mongoose.connection.db.collection('seats').findOne({ seatNumber: 'K1' });
    const sampleJ = await mongoose.connection.db.collection('seats').findOne({ seatNumber: 'J4' }); // This was the problematic one
    
    console.log('\nSample verification:');
    console.log('A1 (should be STANDARD):', { seatNumber: sampleA.seatNumber, category: sampleA.category, price: sampleA.price });
    console.log('F1 (should be PREMIUM):', { seatNumber: sampleF.seatNumber, category: sampleF.category, price: sampleF.price });
    console.log('K1 (should be VIP):', { seatNumber: sampleK.seatNumber, category: sampleK.category, price: sampleK.price });
    console.log('J4 (should be PREMIUM):', { seatNumber: sampleJ.seatNumber, category: sampleJ.category, price: sampleJ.price });
    
    // Check for any remaining mismatched seats
    const stillMismatched = await mongoose.connection.db.collection('seats').find({
      $or: [
        { seatNumber: { $regex: '^[ABCDE]' }, category: { $ne: 'STANDARD' } },
        { seatNumber: { $regex: '^[FGHIJ]' }, category: { $ne: 'PREMIUM' } },
        { seatNumber: { $regex: '^[KLMNO]' }, category: { $ne: 'VIP' } }
      ]
    }).toArray();
    
    if (stillMismatched.length === 0) {
      console.log('\n✅ ALL SEATS PROPERLY CATEGORIZED!');
    } else {
      console.log(`\n❌ Still ${stillMismatched.length} mismatched seats found`);
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

fixAllSeatCategories();
