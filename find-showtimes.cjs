const mongoose = require('mongoose');

async function findCorrectShowtime() {
  try {
    await mongoose.connect('mongodb+srv://arunarivalagan774:arunhari27@movie-mern.iuov1.mongodb.net/?retryWrites=true&w=majority&appName=movie-mern');
    console.log('Connected to MongoDB');
    
    // Find all showtimes
    const showtimes = await mongoose.connection.db.collection('showtimes').find().toArray();
    console.log(`Found ${showtimes.length} showtimes:`);
    
    showtimes.forEach((showtime, index) => {
      console.log(`${index + 1}. ID: ${showtime._id}, Screen: ${showtime.screen}, Start: ${showtime.startTime}`);
    });
    
    // Find all unique showtime IDs that have seats
    const showtimesWithSeats = await mongoose.connection.db.collection('seats').aggregate([
      { $group: { _id: '$showtimeId', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]).toArray();
    
    console.log(`\nShowtimes that have seats (${showtimesWithSeats.length}):`);
    for (const st of showtimesWithSeats) {
      console.log(`Showtime ${st._id}: ${st.count} seats`);
      
      // Check category distribution for this showtime
      const categories = await mongoose.connection.db.collection('seats').aggregate([
        { $match: { showtimeId: st._id } },
        { $group: { _id: '$category', count: { $sum: 1 } } }
      ]).toArray();
      
      console.log(`  Categories:`, categories);
      
      // Sample seats
      const sampleSeats = await mongoose.connection.db.collection('seats').find({ 
        showtimeId: st._id 
      }).limit(3).toArray();
      
      console.log(`  Sample seats:`, sampleSeats.map(s => ({ 
        seatNumber: s.seatNumber, 
        category: s.category, 
        price: s.price 
      })));
      console.log('---');
    }
    
    // Check if there are seats with the problematic showtime ID pattern
    const problematicSeats = await mongoose.connection.db.collection('seats').find({
      showtimeId: { $regex: '68a272eb595b68d501115498' }
    }).toArray();
    
    if (problematicSeats.length > 0) {
      console.log(`\nFound ${problematicSeats.length} seats with similar showtime ID`);
    } else {
      console.log('\nNo seats found with that showtime ID pattern');
    }
    
    // Let's also check for seats that might have string vs ObjectId issues
    const allSeats = await mongoose.connection.db.collection('seats').find().limit(5).toArray();
    console.log('\nSample seat showtimeId types:');
    allSeats.forEach((seat, index) => {
      console.log(`${index + 1}. ShowtimeId: ${seat.showtimeId} (type: ${typeof seat.showtimeId})`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

findCorrectShowtime();
