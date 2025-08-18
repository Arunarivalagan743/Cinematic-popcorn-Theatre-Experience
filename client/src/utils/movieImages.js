// Movie Image Mapping Utility
import Amaran from "../images/amaran.jpg";
import Brother from "../images/brother.jpg";
import NewMovie from "../images/new.jpg";
import Mission from "../images/mission.jpg";

// Image mapping for movies
export const imageMap = {
  'amaran.jpg': Amaran,
  'brother.jpg': Brother,
  'new.jpg': NewMovie,
  'mission.jpg': Mission,
};

// Helper function to get movie image
export const getMovieImage = (movieDetails) => {
  if (!movieDetails) return NewMovie;
  
  // Check for existing imageUrl field (used in Home page)
  if (movieDetails.imageUrl && imageMap[movieDetails.imageUrl]) {
    return imageMap[movieDetails.imageUrl];
  }
  
  // Check for poster/image fields
  if (movieDetails.poster && imageMap[movieDetails.poster]) {
    return imageMap[movieDetails.poster];
  }
  
  if (movieDetails.image && imageMap[movieDetails.image]) {
    return imageMap[movieDetails.image];
  }
  
  // Movie name to image mapping
  const movieName = (movieDetails.name || movieDetails.title || '').toLowerCase();
  
  if (movieName.includes('pushpa')) return NewMovie;
  if (movieName.includes('amaran')) return Amaran;
  if (movieName.includes('brother')) return Brother;
  if (movieName.includes('mission')) return Mission;
  
  // Default fallback
  return NewMovie;
};

export default { imageMap, getMovieImage };
