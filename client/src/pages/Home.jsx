
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Amaran from "../images/amaran.jpg";
import Brother from "../images/brother.jpg";
import NewMovie from "../images/new.jpg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTheaterMasks, faStar, faThumbsUp, faFilm, faTv, faLanguage, faClock } from '@fortawesome/free-solid-svg-icons';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import withReactContent from 'sweetalert2-react-content';

import { FaFilm, FaUser, FaNewspaper, FaTag } from 'react-icons/fa'; // You can import any React icon

const MySwal = withReactContent(Swal);

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { currentUser } = useSelector((state) => state.user);

  const imageMap = {
    'amaran.jpg': Amaran,
    'brother.jpg': Brother,
    'new.jpg': NewMovie,
  };

  const fetchMovies = async () => {
    setLoading(true);
    try {
  const response = await axios.get('https://mern-auth-movie-mov.onrender.com/api/movies');

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

  const showMovieDetails = (movie) => {
    MySwal.fire({
      title: (
        <div className="flex items-center">
          <FaFilm className="mr-2 text-yellow-500 animate-pulse" size={24} />
          <strong>{movie.name}</strong>
        </div>
      ),
      html: (
        <div className="space-y-4">
          <div className="flex items-center animate-bounce">
            <FaTag className="mr-2 text-indigo-400" size={20} />
            <p><strong>Genre:</strong> <span className="text-indigo-500">{movie.genre}</span></p>
          </div>
          <div className="flex items-center animate-bounce">
            <FaUser className="mr-2 text-green-400" size={20} />
            <p><strong>Cast:</strong> <span className="text-green-500">{movie.cast}</span></p>
          </div>
          <div className="flex items-center animate-bounce">
            <FaNewspaper className="mr-2 text-pink-400" size={20} />
            <p><strong>Summary:</strong> <span className="text-pink-500">{movie.summary}</span></p>
          </div>
        </div>
      ),
      background: 'linear-gradient(145deg, #8e2de2, #4a00e0)' ,// A vibrant purple-to-blue gradient
      // Red-orange explosion effect
      color: '#fff',
      icon: 'info',
      confirmButtonText: 'Close',
      showCloseButton: true,
      closeButtonAriaLabel: 'Close modal',
      customClass: {
        popup: 'animated zoomIn', // Zoom-in effect on modal popup
        title: 'text-2xl font-bold text-white',
        htmlContainer: 'p-4 text-lg leading-relaxed',
        icon: 'text-white text-3xl animate-pulse', // Pulsing icon
        confirmButton: 'bg-gradient-to-r from-red-600 to-yellow-500 text-white hover:scale-125 transition-transform ease-out', // Blazing button with hover effect
      },
      didOpen: () => {
        const popup = document.querySelector('.swal2-popup');
        popup.style.transition = 'transform 0.5s ease-in-out';
        popup.style.transform = 'scale(1.2)'; // Explosion expansion
      },
      willClose: () => {
        const popup = document.querySelector('.swal2-popup');
        popup.style.transition = 'transform 0.3s ease-in-out';
        popup.style.transform = 'scale(1)';
      },
      didRender: () => {
        const popup = document.querySelector('.swal2-popup');
        popup.classList.add('animate__animated', 'animate__rubberBand'); // Shaking effect
      },
    });
  };

  const filteredMovies = movies.filter((movie) =>
    movie.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fontFamily = 'font-sans';

  if (loading) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-white to-pink-100 text-gray-700 ${fontFamily}`}>
        <div className="flex items-center space-x-4 mb-4">
          <FontAwesomeIcon icon={faTheaterMasks} className="text-6xl animate-spin" />
          <h1 className="text-3xl font-semibold">Cinematic Popcorn Park</h1>
        </div>
        <div className="text-center text-2xl font-semibold text-gray-500 mt-20 animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-white to-red-100 text-red-500 ${fontFamily}`}>
        <div className="text-center mt-10">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-white to-pink-50 text-gray-800 p-4 ${fontFamily}`}>
      <h1 className="text-3xl lg:text-4xl font-bold mb-8 text-center text-pink-500 tracking-wide flex items-center justify-center">
        <FontAwesomeIcon icon={faTheaterMasks} className="mr-2 text-pink-300" />
        Now Showing
      </h1>

      {/* Display logged-in user's email */}
      {currentUser && (
        <div className="text-center text-lg mb-6 text-green-600">
          <p>Welcome, {currentUser.email}</p>
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-6 flex justify-center gap-4">
        <div className="flex items-center bg-gradient-to-r from-pink-400 to-purple-500 rounded-lg shadow-lg transition-transform duration-300 hover:scale-105">
          <FontAwesomeIcon icon={faSearch} className="text-white p-2" />
          <input
            type="text"
            placeholder="Search for a movie..."
            className="p-2 rounded-lg bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all duration-300 ease-in-out w-40 md:w-60 focus:w-80"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredMovies.map((movie) => (
          <div
            key={movie._id}
            className="relative group bg-white rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105"
          >
            <div
              className="relative w-auto max-h-fit overflow-hidden cursor-pointer"
              onClick={() => showMovieDetails(movie)}
            >
              <img
                src={imageMap[movie.imageUrl] || 'path/to/default-image.jpg'}
                alt={movie.name || 'Movie Poster'}
                className="w-full h-full object-cover object-center opacity-90 transition-opacity duration-300 group-hover:opacity-70"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gray-900 bg-opacity-80 flex gap-2 items-center p-2">
                <div className="flex items-center text-yellow-500 font-bold">
                  <FontAwesomeIcon icon={faStar} className="mr-1" />
                  {movie.ratings}
                </div>
                <div className="flex items-center text-blue-500 font-bold">
                  <FontAwesomeIcon icon={faThumbsUp} className="mr-1" />
                  {movie.votes} Votes
                </div>
              </div>
            </div>

            <div className="p-4 text-gray-600 text-sm md:text-base space-y-4 font-[Lora]">
  <p className="text-xl md:text-2xl font-extrabold text-pink-600 flex items-center gap-3">
    <FontAwesomeIcon icon={faFilm} className="text-pink-500" />
    {movie.name}
  </p>
  <p className="text-base md:text-lg font-medium text-purple-400 flex items-center gap-3">
    <FontAwesomeIcon icon={faTv} className="text-purple-500" />
    Screen: <span className="font-semibold">{movie.screen}</span>
  </p>
  <p className="text-base md:text-lg font-medium text-green-400 flex items-center gap-3">
    <FontAwesomeIcon icon={faLanguage} className="text-green-500" />
    Language: <span className="font-semibold">{movie.language}</span>
  </p>
  <p className="text-base md:text-lg font-medium text-blue-400 flex items-center gap-3">
    <FontAwesomeIcon icon={faClock} className="text-blue-500" />
    Timing: <span className="font-semibold">{movie.timing}</span>
  </p>
</div>


            <div className="p-4 text-center mt-auto">
              <Link to={`/tickets/${movie.name}/${movie.screen}/${movie.timing}`}>
                <button
                  className="bg-gradient-to-r from-pink-400 to-orange-400 text-white font-bold py-2 px-4 md:px-6 rounded-lg transition duration-300 transform hover:scale-110 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-pink-300"
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
