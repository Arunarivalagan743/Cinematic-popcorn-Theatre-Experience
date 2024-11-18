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

  // const fetchMovies = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await axios.get('http://localhost:5000/movies');
  //     setMovies(response.data);
  //     setError(null);
  //   } catch (err) {
  //     setError('Failed to fetch movies');
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  const fetchMovies = async () => {
    setLoading(true);
    try {
      // Use a relative URL for the API request
      const response = await axios.get('api/movies'); 
      setMovies(response.data);
      setError(null);
    } catch (err) {
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 text-white">
        <div className="flex items-center space-x-4 mb-4">
          <FontAwesomeIcon icon={faTicketAlt} className="text-6xl animate-spin" />
          <h1 className="text-3xl font-semibold">Cinematic Popcorn Park</h1>
        </div>
        <div className="text-center text-2xl font-semibold text-gray-300 mt-20 animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 text-red-500">
        <div className="text-center mt-10">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 text-white p-4">
      <h1 className="text-3xl lg:text-4xl font-bold mb-8 text-center text-yellow-500 tracking-wide flex items-center justify-center">
        <FontAwesomeIcon icon={faTheaterMasks} className="mr-2 text-yellow-300" />
        Now Showing
      </h1>

      <div className="flex flex-col md:flex-row md:flex-wrap md:justify-center items-center gap-4 mb-8">
        {movies.map((movie) => (
          <div
            key={movie._id}
            className="bg-gray-800 bg-opacity-70 rounded-lg overflow-hidden relative transition-transform duration-500 hover:scale-105 w-full md:w-1/2 lg:w-1/3 xl:w-1/4"
          >
            <div className="relative w-full h-90 overflow-hidden group">
              <img
                src={imageMap[movie.imageUrl] || 'path/to/default-image.jpg'}
                alt={movie.movieName || 'Movie Poster'}
                className="w-full h-full object-cover object-center opacity-80 transition-opacity duration-300 group-hover:opacity-50"
              />

              {/* Summary Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <div className="text-center p-4 text-white text-xs md:text-sm lg:text-base">
                  <h3 className="font-bold mb-2">Summary</h3>
                  <p className="animate-fade-in">{movie.summary}</p>
                </div>
              </div>
              {showRatingOverlay === movie._id && (
                <div className="absolute top-4 right-4 bg-yellow-500 text-black font-bold py-1 px-2 md:px-4 rounded-full transform rotate-6 shadow-md">
                  <FontAwesomeIcon icon={faStar} className="mr-1" />
                  {movie.ratings}
                </div>
              )}
            </div>
            <div className="p-4 md:p-6 text-gray-300 text-sm md:text-base">
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
              <p className="flex items-center gap-2 mt-2">
                <FontAwesomeIcon icon={faTicketAlt} className="text-purple-400" />
                <span className="text-purple-400">Timing:</span> {movie.timing}
              </p>
            </div>
            <div className="p-4 text-center">
              <Link to={`/tickets/${movie.name}/${movie.screen}/${movie.timing}`}>
                <button
                  className="bg-gradient-to-r from-pink-500 to-orange-500 text-white font-bold py-2 px-4 md:px-6 rounded-lg transition duration-300 transform hover:scale-110 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-pink-300 animate-bounce"
                  onMouseEnter={() => setShowRatingOverlay(movie._id)}
                  onMouseLeave={() => setShowRatingOverlay(null)}
                >
                  Book Now
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      <Footer />
    </div>
  );
};

export default Home;
