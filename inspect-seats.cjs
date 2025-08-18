const mongoose = require('mongoose');

async function inspectSeats() {
  try {
    await mongoose.connect('mongodb+srv://arunarivalagan774:arunhari27@movie-mern.iuov1.mongodb.net/?retryWrites=true&w=majority&appName=movie-mern');
    console.log('Connected to MongoDB');
    
    // Get raw seat data to see the actual structure
    const seats = await mongoose.connection.db.collection('seats').find().limit(10).toArray();
    console.log('Raw seat data structure:');
    console.log(JSON.stringify(seats[0], null, 2));
    
    console.log('\nFirst 10 seats:');
    seats.forEach((seat, index) => {
      console.log(`${index + 1}. SeatNumber: "${seat.seatNumber}", Row: "${seat.row}", Category: "${seat.category}", Price: ${seat.price}`);
    });
    
    // Check categories distribution
    const categoryStats = await mongoose.connection.db.collection('seats').aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]).toArray();
    console.log('\nCategory distribution:', categoryStats);
    
    // Look for seats with different seatNumber patterns
    const seatNumberPatterns = await mongoose.connection.db.collection('seats').aggregate([
      { $group: { _id: { $substr: ['$seatNumber', 0, 1] }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]).toArray();
    console.log('\nSeat number patterns (first character):', seatNumberPatterns);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

inspectSeats();
