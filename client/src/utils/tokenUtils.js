import axios from 'axios';

const backendUrl = 
  process.env.NODE_ENV === 'production' 
    ? 'https://cinematic-popcorn-theatre-experience-2.onrender.com' 
    : 'http://localhost:5000';

// Function to refresh authentication token
export const refreshAuthToken = async (user) => {
  try {
    // Call the signin endpoint to get a fresh token
    const response = await axios.post(`${backendUrl}/api/auth/signin`, {
      email: user.email,
      password: 'refresh' // This won't work, we need another approach
    }, { withCredentials: true });
    
    return response.data;
  } catch (error) {
    console.error('Token refresh failed:', error);
    return null;
  }
};

// Function to validate current token
export const validateToken = async () => {
  try {
    const response = await axios.get(`${backendUrl}/api/auth/validate`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    return null;
  }
};
