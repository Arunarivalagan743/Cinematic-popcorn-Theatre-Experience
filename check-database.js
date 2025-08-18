import mongoose from 'mongoose';

async function checkDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb+srv://arunarivalagan774:arunhari27@movie-mern.iuov1.mongodb.net/?retryWrites=true&w=majority&appName=movie-mern');
    console.log('Connected to MongoDB');
    
    // Get collection stats
    const collections = await mongoose.connection.db.collections();
    console.log('Available collections:', collections.map(c => c.collectionName).join(', '));
    
    // Get counts
    const movies = await mongoose.connection.db.collection('movies').find().toArray();
    console.log(`Found ${movies.length} movies`);
    
    const showtimes = await mongoose.connection.db.collection('showtimes').find().toArray();
    console.log(`Found ${showtimes.length} showtimes`);
    
    // Check showtimes for each movie
    console.log('\nMovies and their showtimes:');
    for (const movie of movies) {
      const movieShowtimes = showtimes.filter(s => 
        s.movieId && s.movieId.toString() === movie._id.toString());
      
      console.log(`- ${movie.name}: ${movieShowtimes.length} showtimes`);
      
      if (movieShowtimes.length === 0) {
        console.log(`  WARNING: No showtimes for movie ${movie.name}`);
      } else {
        for (const showtime of movieShowtimes) {
          console.log(`  * Screen ${showtime.screen} at ${new Date(showtime.startTime).toLocaleString()}`);
        }
      }
    }
    
    // Check for orphaned showtimes
    const orphanedShowtimes = showtimes.filter(s => 
      !movies.some(m => m._id.toString() === s.movieId?.toString()));
    
    if (orphanedShowtimes.length > 0) {
      console.log(`\nWARNING: Found ${orphanedShowtimes.length} orphaned showtimes`);
      for (const showtime of orphanedShowtimes) {
        console.log(`- Showtime ID: ${showtime._id}, Movie ID: ${showtime.movieId}`);
      }
    }
    
    mongoose.connection.close();
    console.log('\nConnection closed');
  } catch (error) {
    console.error('Error:', error);
  }
}

checkDatabase();
