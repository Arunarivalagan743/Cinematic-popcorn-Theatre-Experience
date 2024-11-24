
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import Swal from 'sweetalert2';
// import Amaran from "../images/amaran.jpg";
// import Brother from "../images/brother.jpg";
// import NewMovie from "../images/new.jpg";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faStar, faFilm, faTheaterMasks, faTicketAlt, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
// import Footer from '../components/Footer';
// import { Link, useNavigate } from 'react-router-dom';
// import withReactContent from 'sweetalert2-react-content';

// const MySwal = withReactContent(Swal);

// const Home = () => {
//   const [movies, setMovies] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showRatingOverlay, setShowRatingOverlay] = useState(null);

//   const navigate = useNavigate();

//   const imageMap = {
//     'amaran.jpg': Amaran,
//     'brother.jpg': Brother,
//     'new.jpg': NewMovie,
//   };

//   const fetchMovies = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get('/api/movies');
//       setMovies(response.data);
//       setError(null);
//     } catch (err) {
//       setError('Failed to fetch movies');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchMovies();
//   }, []);

//   // Function to show SweetAlert popup with only movie name and screen number
//   const showMovieDetails = (movie) => {
//     MySwal.fire({
//       title: `<strong>${movie.name}</strong>`,
//       html: `
//         <p><strong>Genre:</strong> ${movie.genre}</p>
//         <p><strong>Cast:</strong> ${movie.cast}</p>
//         <p><strong>Summary:</strong> ${movie.summary}</p>
//       `,
//       background: 'linear-gradient(to right, #1a1a1d, #4e4e50)',
//       color: '#fff',
//       icon: 'info',
//       confirmButtonText: 'Close',
//       customClass: {
//         popup: 'animated fadeIn',
//       },
//     });
//   };

//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 to-black text-white">
//         <div className="flex items-center space-x-4 mb-4">
//           <FontAwesomeIcon icon={faTicketAlt} className="text-6xl animate-spin" />
//           <h1 className="text-3xl font-semibold">Cinematic Popcorn Park</h1>
//         </div>
//         <div className="text-center text-2xl font-semibold text-gray-300 mt-20 animate-pulse">
//           Loading...
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 to-black text-red-500">
//         <div className="text-center mt-10">
//           {error}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br text-white p-4">
//       <h1 className="text-3xl lg:text-4xl font-bold mb-8 text-center text-yellow-500 tracking-wide flex items-center justify-center">
//         <FontAwesomeIcon icon={faTheaterMasks} className="mr-2 text-yellow-300" />
//         Now Showing
//       </h1>
      
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//         {movies.map((movie) => (
//           <div
//             key={movie._id}
//             className="relative group bg-gray-900 rounded-lg overflow-hidden shadow-lg"
//           >
//             <div
//               className="relative w-auto max-h-fit overflow-hidden cursor-pointer"
//               onClick={() => showMovieDetails(movie)}
//             >
//               <img
//                 src={imageMap[movie.imageUrl] || 'path/to/default-image.jpg'}
//                 alt={movie.name || 'Movie Poster'}
//                 className="w-full h-full object-cover object-center opacity-80 transition-opacity duration-300 group-hover:opacity-50"
//               />

//               {/* Combined Rating and Votes Overlay */}
//               <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-80 flex gap-2 items-center p-2">
//                 <div className="flex items-center text-yellow-500 font-bold">
//                   <FontAwesomeIcon icon={faStar} className="mr-1" />
//                   {movie.ratings}
//                 </div>
//                 <div className="flex items-center text-blue-500 font-bold">
//                   <FontAwesomeIcon icon={faThumbsUp} className="mr-1" />
//                   {movie.votes} Votes
//                 </div>
//               </div>
//             </div>

//             <div className="p-4 text-center text-gray-300 text-sm md:text-base">
//               <p className="text-lg font-semibold text-orange-400">{movie.name}</p>
//               <p className="text-sm text-purple-400">Screen: {movie.screen}</p>
//               <p className="text-sm text-green-400">Language: {movie.language}</p>
//             </div>

//             <div className="p-4 text-center mt-auto">
//               <Link to={`/tickets/${movie.name}/${movie.screen}/${movie.timing}`}>
//                 <button
//                   className="bg-gradient-to-r from-pink-500 to-orange-500 text-white font-bold py-2 px-4 md:px-6 rounded-lg transition duration-300 transform hover:scale-110 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-pink-300"
//                   onMouseEnter={() => setShowRatingOverlay(movie._id)}
//                   onMouseLeave={() => setShowRatingOverlay(null)}
//                 >
//                   Book Now
//                 </button>
//               </Link>
//             </div>
//           </div>
//         ))}
//       </div>

//       <Footer />
//     </div>
//   );
// };

// export default Home;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Amaran from "../images/amaran.jpg";
import Brother from "../images/brother.jpg";
import NewMovie from "../images/new.jpg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faFilm, faTheaterMasks, faTicketAlt, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import Footer from '../components/Footer';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRatingOverlay, setShowRatingOverlay] = useState(null);
  const navigate = useNavigate();

  const { currentUser } = useSelector((state) => state.user); // Access the user from Redux store

  const imageMap = {
    'amaran.jpg': Amaran,
    'brother.jpg': Brother,
    'new.jpg': NewMovie,
  };

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/movies');
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

  // Function to show SweetAlert popup with only movie name and screen number
  const showMovieDetails = (movie) => {
    MySwal.fire({
      title: `<strong>${movie.name}</strong>`,
      html: `
        <p><strong>Genre:</strong> ${movie.genre}</p>
        <p><strong>Cast:</strong> ${movie.cast}</p>
        <p><strong>Summary:</strong> ${movie.summary}</p>
      `,
      background: 'linear-gradient(to right, #1a1a1d, #4e4e50)',
      color: '#fff',
      icon: 'info',
      confirmButtonText: 'Close',
      customClass: {
        popup: 'animated fadeIn',
      },
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 to-black text-white">
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 to-black text-red-500">
        <div className="text-center mt-10">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br text-white p-4">
      <h1 className="text-3xl lg:text-4xl font-bold mb-8 text-center text-yellow-500 tracking-wide flex items-center justify-center">
        <FontAwesomeIcon icon={faTheaterMasks} className="mr-2 text-yellow-300" />
        Now Showing
      </h1>

      {/* Display logged-in user's email */}
      {currentUser && (
        <div className="text-center text-lg mb-6 text-green-400">
          <p>Welcome, {currentUser.email}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {movies.map((movie) => (
          <div
            key={movie._id}
            className="relative group bg-gray-900 rounded-lg overflow-hidden shadow-lg"
          >
            <div
              className="relative w-auto max-h-fit overflow-hidden cursor-pointer"
              onClick={() => showMovieDetails(movie)}
            >
              <img
                src={imageMap[movie.imageUrl] || 'path/to/default-image.jpg'}
                alt={movie.name || 'Movie Poster'}
                className="w-full h-full object-cover object-center opacity-80 transition-opacity duration-300 group-hover:opacity-50"
              />

              {/* Combined Rating and Votes Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-80 flex gap-2 items-center p-2">
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

            <div className="p-4 text-center text-gray-300 text-sm md:text-base">
              <p className="text-lg font-semibold text-orange-400">{movie.name}</p>
              <p className="text-sm text-purple-400">Screen: {movie.screen}</p>
              <p className="text-sm text-green-400">Language: {movie.language}</p>
            </div>

            <div className="p-4 text-center mt-auto">
              <Link to={`/tickets/${movie.name}/${movie.screen}/${movie.timing}`}>
                <button
                  className="bg-gradient-to-r from-pink-500 to-orange-500 text-white font-bold py-2 px-4 md:px-6 rounded-lg transition duration-300 transform hover:scale-110 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-pink-300"
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
