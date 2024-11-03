


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Amaran from "../images/amaran.jpg";
import Brother from "../images/brother.jpg";
import NewMovie from "../images/new.jpg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faFilm, faLanguage, faTicketAlt, faTheaterMasks, faDesktop } from '@fortawesome/free-solid-svg-icons';
import Footer from '../components/Footer'; 
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRatingOverlay, setShowRatingOverlay] = useState(null);

  const navigate = useNavigate();

  const imageMap = {
    'amaran.jpg': Amaran,
    'brother.jpg': Brother,
    'new.jpg': NewMovie,
  };

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/movies');
      console.log(response.data); // Log the response
      setMovies(response.data);
      setError(null); // Reset error on successful fetch
    } catch (err) {
      console.error(err); // Log the error
      setError('Failed to fetch movies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 to-purple-800 text-white">
        <div className="flex items-center space-x-4 mb-4">
          <FontAwesomeIcon icon={faTicketAlt} className="text-6xl animate-spin" />
          <h1 className="text-3xl font-semibold">Cinematic Popcorn Park</h1>
        </div>
        <div className="text-center text-2xl font-semibold text-gray-300 mt-20 animate-pulse">
          Loading...
        </div>
        <div className="mt-8">
          <div className="w-32 h-2 bg-gray-300 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-yellow-500 to-pink-500 animate-loading" />
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 to-purple-800 text-red-500">
        <FontAwesomeIcon icon={faExclamationTriangle} className="text-6xl mb-4" />
        <div className="text-center mt-10">
          {error}
        </div>
      </div>
    );
  }
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-purple-800 text-white p-4">
      <h1 className="text-4xl font-bold mb-8 text-center text-yellow-500 tracking-wide flex items-center justify-center">
        <FontAwesomeIcon icon={faTheaterMasks} className="mr-2 text-yellow-300" />
        Now Showing
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {movies.length > 0 ? (
          movies.map((movie) => (
            <div
              key={movie._id}
              className="bg-gray-800 bg-opacity-70 rounded-lg overflow-hidden relative transition-transform duration-500 hover:scale-105"
            >
              <div className="relative">
                <img
                  src={imageMap[movie.imageUrl] || 'path/to/default-image.jpg'} // Fallback image
                  alt={movie.movieName || 'Movie Poster'}
                  className="w-full h-56 object-cover opacity-80 transition-opacity duration-300 hover:opacity-100"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black to-transparent opacity-0 transition-opacity duration-300 hover:opacity-90">
                  <div className="text-center p-4 text-white">
                    <h3 className="font-bold text-lg mb-2">Summary</h3>
                    <p>{movie.summary}</p>
                  </div>
                </div>
                {showRatingOverlay === movie._id && (
                  <div className="absolute top-4 right-4 bg-yellow-500 text-black font-bold py-1 px-4 rounded-full transform rotate-6 shadow-md transition-transform duration-300">
                    <FontAwesomeIcon icon={faStar} className="mr-1" />
                    {movie.ratings}
                  </div>
                )}
              </div>
              <div className="p-6 text-gray-300">
                <p className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faFilm} className="text-purple-400" />
                  <span className="text-orange-400">Name:</span> {movie.name}
                </p>
                <p className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faFilm} className="text-purple-400" />
                  <span className="text-purple-400">Genre:</span> {movie.genre}
                </p>
                <p className="flex items-center gap-2 mt-2">
                  <FontAwesomeIcon icon={faLanguage} className="text-purple-400" />
                  <span className="text-purple-400">Language:</span> {movie.language}
                </p>
                <p className="flex items-center gap-2 mt-2">
                  <FontAwesomeIcon icon={faTicketAlt} className="text-purple-400" />
                  <span className="text-purple-400">Cast:</span> {movie.cast}
                </p>
                <p className="flex items-center gap-2 mt-2">
                  <FontAwesomeIcon icon={faDesktop} className="text-purple-400" />
                  <span className="text-purple-400">Screen:</span> {movie.screen}
                </p>
              </div>
              <div className="p-4 text-center">
                <button
                  className="bg-gradient-to-r from-pink-500 to-orange-500 text-white font-bold py-2 px-6 rounded-lg transition duration-300 transform hover:scale-110 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-pink-300"
                  onMouseEnter={() => setShowRatingOverlay(movie._id)}
                  onMouseLeave={() => setShowRatingOverlay(null)}
                  // onClick={() => navigate(`/tickets/${movie.movieName}`)} 
                >
                <Link to = "/Tickets">Book Now</Link> 
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-300 mt-10">No movies available.</div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Home;









