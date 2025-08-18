// test-api.js - Simple script to test API endpoints
import axios from 'axios';

// Configuration
const backendUrl = 'http://localhost:5000';

async function testMoviesAPI() {
  try {
    console.log('Testing GET /api/movies endpoint...');
    const moviesResponse = await axios.get(`${backendUrl}/api/movies`);
    console.log(`Success! Found ${moviesResponse.data.length} movies`);
    
    // Test the first movie
    if (moviesResponse.data.length > 0) {
      const firstMovie = moviesResponse.data[0];
      console.log(`\nFirst movie details:`);
      console.log(`- Name: ${firstMovie.name}`);
      console.log(`- ID: ${firstMovie._id}`);
      
      // Check if movie has showtimes
      if (firstMovie.showtimes && firstMovie.showtimes.length > 0) {
        console.log(`- Has ${firstMovie.showtimes.length} showtimes`);
        console.log(`- First showtime ID: ${firstMovie.showtimes[0]._id || firstMovie.showtimes[0] || 'undefined'}`);
        
        // Test getting showtime details
        console.log('\nTesting GET /api/showtimes/:id endpoint...');
        try {
          const showtimeId = firstMovie.showtimes[0]._id || firstMovie.showtimes[0];
          const showtimeResponse = await axios.get(`${backendUrl}/api/showtimes/${showtimeId}`);
          console.log(`Success! Showtime details:`);
          console.log(`- Screen: ${showtimeResponse.data.screen}`);
          console.log(`- Start time: ${new Date(showtimeResponse.data.startTime).toLocaleString()}`);
          console.log(`- End time: ${new Date(showtimeResponse.data.endTime).toLocaleString()}`);
        } catch (err) {
          console.error(`Error fetching showtime: ${err.message}`);
          if (err.response) {
            console.error(`Status: ${err.response.status}`);
            console.error(`Data: ${JSON.stringify(err.response.data)}`);
          }
        }
      } else {
        console.log('- No showtimes found for this movie');
      }
    }
    
  } catch (err) {
    console.error(`Error testing API: ${err.message}`);
    if (err.response) {
      console.error(`Status: ${err.response.status}`);
      console.error(`Data: ${JSON.stringify(err.response.data)}`);
    }
  }
}

testMoviesAPI();
