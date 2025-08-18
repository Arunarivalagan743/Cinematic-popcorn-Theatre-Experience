const mongoose = require('mongoose');

async function fixSeatCategoriesBySeatNumber() {
  try {
    await mongoose.connect('mongodb+srv://arunarivalagan774:arunhari27@movie-mern.iuov1.mongodb.net/?retryWrites=true&w=majority&appName=movie-mern');
    console.log('Connected to MongoDB');
    
    console.log('Updating seat categories based on seatNumber...');
    
    // Update STANDARD seats (rows A-E)
    const standardResult = await mongoose.connection.db.collection('seats').updateMany(
      { seatNumber: { $regex: '^[ABCDE]' } },
      { 
        $set: { 
          category: 'STANDARD',
          price: 150
        }
      }
    );
    console.log(`Updated ${standardResult.modifiedCount} STANDARD seats (rows A-E)`);
    
    // Update PREMIUM seats (rows F-J)
    const premiumResult = await mongoose.connection.db.collection('seats').updateMany(
      { seatNumber: { $regex: '^[FGHIJ]' } },
      { 
        $set: { 
          category: 'PREMIUM',
          price: 180
        }
      }
    );
    console.log(`Updated ${premiumResult.modifiedCount} PREMIUM seats (rows F-J)`);
    
    // Update VIP seats (rows K-O)
    const vipResult = await mongoose.connection.db.collection('seats').updateMany(
      { seatNumber: { $regex: '^[KLMNO]' } },
      { 
        $set: { 
          category: 'VIP',
          price: 250
        }
      }
    );
    console.log(`Updated ${vipResult.modifiedCount} VIP seats (rows K-O)`);
    
    // Verify the update
    console.log('\nVerifying updates...');
    const newCounts = await mongoose.connection.db.collection('seats').aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]).toArray();
    console.log('New category distribution:', newCounts);
    
    // Sample verification
    const rowA = await mongoose.connection.db.collection('seats').find({ seatNumber: { $regex: '^A' } }).limit(3).toArray();
    const rowF = await mongoose.connection.db.collection('seats').find({ seatNumber: { $regex: '^F' } }).limit(3).toArray();
    const rowK = await mongoose.connection.db.collection('seats').find({ seatNumber: { $regex: '^K' } }).limit(3).toArray();
    
    console.log('\nSample verification:');
    console.log('Row A (STANDARD):', rowA.map(s => ({ seatNumber: s.seatNumber, category: s.category, price: s.price })));
    console.log('Row F (PREMIUM):', rowF.map(s => ({ seatNumber: s.seatNumber, category: s.category, price: s.price })));
    console.log('Row K (VIP):', rowK.map(s => ({ seatNumber: s.seatNumber, category: s.category, price: s.price })));
    
    console.log('\nSeat categories fixed successfully!');
    
  } catch (error) {
    console.error('Error fixing seat categories:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

fixSeatCategoriesBySeatNumber();
