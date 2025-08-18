// Simple script to fetch and log movie data
import axios from 'axios';

async function fetchMovies() {
  try {
    const backendUrl = 'http://localhost:5000';
    console.log('Fetching movies from:', backendUrl);
    
    const response = await axios.get(`${backendUrl}/api/movies`, {
      withCredentials: true,
    });

    console.log('Found', response.data.length, 'movies');
    
    // Check if movies have showtimes
    response.data.forEach((movie, index) => {
      console.log(`\nMovie ${index + 1}: ${movie.name}`);
      console.log(`- Has showtimes array: ${!!movie.showtimes}`);
      if (movie.showtimes) {
        console.log(`- Showtimes length: ${movie.showtimes.length}`);
        if (movie.showtimes.length > 0) {
          console.log(`- First showtime ID: ${movie.showtimes[0]._id || 'undefined'}`);
        }
      }
    });
    
  } catch (err) {
    console.error('Error fetching movies:', err.message);
    if (err.response) {
      console.error('Response data:', err.response.data);
      console.error('Response status:', err.response.status);
    }
  }
}

// Execute the function
fetchMovies();
