// Movie Image Mapping Utility
import Amaran from "../images/amaran.jpg";
import Brother from "../images/brother.jpg";
import NewMovie from "../images/new.jpg";
import Mission from "../images/mission.jpg";
import CiniPop from "../images/cinipop.webp"; // Generic cinema poster

// Image mapping for movies
export const imageMap = {
  'amaran.jpg': Amaran,
  'brother.jpg': Brother,
  'new.jpg': NewMovie,
  'mission.jpg': Mission,
  'cinipop.webp': CiniPop,
};

// Helper function to get movie image
export const getMovieImage = (movieDetails) => {
  if (!movieDetails) {
    console.log('No movie details provided, using default');
    return NewMovie;
  }
  
  console.log('Getting image for movie:', movieDetails);
  
  // Check for existing imageUrl field (used in Home page)
  if (movieDetails.imageUrl && imageMap[movieDetails.imageUrl]) {
    console.log('Found imageUrl mapping:', movieDetails.imageUrl);
    return imageMap[movieDetails.imageUrl];
  }
  
  // Check for poster/image fields
  if (movieDetails.poster && imageMap[movieDetails.poster]) {
    console.log('Found poster mapping:', movieDetails.poster);
    return imageMap[movieDetails.poster];
  }
  
  if (movieDetails.image && imageMap[movieDetails.image]) {
    console.log('Found image mapping:', movieDetails.image);
    return imageMap[movieDetails.image];
  }
  
  // Movie name to image mapping
  const movieName = (movieDetails.name || movieDetails.title || '').toLowerCase();
  console.log('Trying to match movie name:', movieName);
  
  if (movieName.includes('pushpa')) {
    console.log('Matched Pushpa -> using NewMovie');
    return NewMovie;
  }
  if (movieName.includes('amaran')) {
    console.log('Matched Amaran');
    return Amaran;
  }
  if (movieName.includes('brother')) {
    console.log('Matched Brother');
    return Brother;
  }
  if (movieName.includes('mission')) {
    console.log('Matched Mission');
    return Mission;
  }
  
  // Additional movie name mappings
  if (movieName.includes('new')) {
    console.log('Matched "new" keyword');
    return NewMovie;
  }
  
  // Default fallback
  console.log('No match found, using default NewMovie');
  return NewMovie;
};

export default { imageMap, getMovieImage };
