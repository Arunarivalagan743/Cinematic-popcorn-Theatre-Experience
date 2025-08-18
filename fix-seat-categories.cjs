const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  showtimeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Showtime', required: true },
  seatNumber: { type: String, required: true },
  row: { type: String, required: true },
  status: { type: String, enum: ['AVAILABLE', 'BOOKED', 'HELD', 'MAINTENANCE'], default: 'AVAILABLE' },
  category: { type: String, enum: ['STANDARD', 'PREMIUM', 'VIP'], default: 'STANDARD' },
  price: { type: Number, default: 150 }
}, { timestamps: true });

const Seat = mongoose.model('Seat', seatSchema);

async function fixSeatCategories() {
  try {
    await mongoose.connect('mongodb+srv://arunarivalagan774:arunhari27@movie-mern.iuov1.mongodb.net/?retryWrites=true&w=majority&appName=movie-mern');
    console.log('Connected to MongoDB');
    
    console.log('Checking current seat data...');
    
    // Check current state
    const totalSeats = await Seat.countDocuments();
    console.log(`Total seats: ${totalSeats}`);
    
    const currentCounts = await Seat.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    console.log('Current category distribution:', currentCounts);
    
    // Sample current data
    const sampleSeats = await Seat.find().limit(5);
    console.log('Sample seats:', sampleSeats.map(s => ({ row: s.row, category: s.category, price: s.price })));
    
    console.log('\nUpdating seat categories...');
    
    // Update STANDARD seats (rows A-E)
    const standardResult = await Seat.updateMany(
      { row: { $in: ['A', 'B', 'C', 'D', 'E'] } },
      { 
        $set: { 
          category: 'STANDARD',
          price: 150
        }
      }
    );
    console.log(`Updated ${standardResult.modifiedCount} STANDARD seats`);
    
    // Update PREMIUM seats (rows F-J)
    const premiumResult = await Seat.updateMany(
      { row: { $in: ['F', 'G', 'H', 'I', 'J'] } },
      { 
        $set: { 
          category: 'PREMIUM',
          price: 180
        }
      }
    );
    console.log(`Updated ${premiumResult.modifiedCount} PREMIUM seats`);
    
    // Update VIP seats (rows K-O)
    const vipResult = await Seat.updateMany(
      { row: { $in: ['K', 'L', 'M', 'N', 'O'] } },
      { 
        $set: { 
          category: 'VIP',
          price: 250
        }
      }
    );
    console.log(`Updated ${vipResult.modifiedCount} VIP seats`);
    
    // Verify the update
    console.log('\nVerifying updates...');
    const newCounts = await Seat.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    console.log('New category distribution:', newCounts);
    
    // Sample verification
    const rowA = await Seat.find({ row: 'A' }).limit(2);
    const rowF = await Seat.find({ row: 'F' }).limit(2);
    const rowK = await Seat.find({ row: 'K' }).limit(2);
    
    console.log('\nSample verification:');
    console.log('Row A (STANDARD):', rowA.map(s => ({ row: s.row, category: s.category, price: s.price })));
    console.log('Row F (PREMIUM):', rowF.map(s => ({ row: s.row, category: s.category, price: s.price })));
    console.log('Row K (VIP):', rowK.map(s => ({ row: s.row, category: s.category, price: s.price })));
    
    console.log('\nSeat categories fixed successfully!');
    
  } catch (error) {
    console.error('Error fixing seat categories:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

fixSeatCategories();
