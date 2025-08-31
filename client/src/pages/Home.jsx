
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTheaterMasks, faStar, faThumbsUp, faFilm, faTv, faLanguage, faClock, faSync } from '@fortawesome/free-solid-svg-icons';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import withReactContent from 'sweetalert2-react-content';

import { FaFilm, FaUser, FaNewspaper, FaTag } from 'react-icons/fa'; // You can import any React icon

// Import the shared movie image utility
import { imageMap } from '../utils/movieImages';

const MySwal = withReactContent(Swal);

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const { currentUser } = useSelector((state) => state.user);

  // Function to check if a showtime is still bookable
  const isShowtimeBookable = (showtime) => {
    // First check if the showtime exists and has required properties
    if (!showtime || !showtime.startTime || !showtime.endTime) {
      console.log('Showtime invalid or missing required properties');
      return false;
    }
    
    const currentTime = new Date();
    
    // Get all relevant time data
    const showtimeStart = new Date(showtime.startTime);
    const showtimeEnd = new Date(showtime.endTime);
    const cutoffMinutes = showtime.cutoffMinutes || 5; // Default 5 minutes cutoff
    const cutoffTime = new Date(showtimeStart.getTime() - (cutoffMinutes * 60000));
    
    // Calculate time differences for better debugging
    const minutesUntilStart = Math.floor((showtimeStart - currentTime) / (1000 * 60));
    const minutesUntilEnd = Math.floor((showtimeEnd - currentTime) / (1000 * 60));
    const minutesUntilCutoff = Math.floor((cutoffTime - currentTime) / (1000 * 60));
    
    // Debug logging with enhanced information
    console.log('Showtime check:', {
      movieId: showtime.movieId?.name || showtime.movieId,
      screen: showtime.screen,
      currentTime: currentTime.toLocaleString(),
      showtimeStart: showtimeStart.toLocaleString(),
      showtimeEnd: showtimeEnd.toLocaleString(),
      cutoffTime: cutoffTime.toLocaleString(),
      isAfterCutoff: currentTime > cutoffTime,
      isAfterStart: currentTime > showtimeStart,
      isAfterEnd: currentTime > showtimeEnd,
      isArchived: showtime.isArchived,
      minutesUntilStart,
      minutesUntilEnd,
      minutesUntilCutoff,
      bookingAvailable: showtime.bookingAvailable
    });
    
    // If the backend already determined booking availability, use that value
    if (showtime.hasOwnProperty('bookingAvailable')) {
      const result = showtime.bookingAvailable === true;
      console.log(`Using backend bookingAvailable value: ${result}`);
      return result;
    }
    
    // Otherwise, check all conditions manually
    
    // Check if showtime is archived
    if (showtime.isArchived) {
      console.log('Showtime is archived');
      return false;
    }
    
    // Check if showtime has already ended
    if (currentTime > showtimeEnd) {
      console.log('Showtime has already ended');
      return false;
    }
    
    // Check if showtime has already started
    if (currentTime > showtimeStart) {
      console.log('Showtime has already started');
      return false;
    }
    
    // Check if cutoff time has passed
    if (currentTime > cutoffTime) {
      console.log('Cutoff time has passed');
      return false;
    }
    
    return true;
  };

  // Function to get time remaining until cutoff
  const getTimeUntilCutoff = (showtime) => {
    if (!showtime || !showtime.startTime) return null;
    
    // First check if the showtime is bookable
    if (!isShowtimeBookable(showtime)) return null;
    
    const currentTime = new Date();
    
    // startTime is already a complete Date object
    const showtimeStart = new Date(showtime.startTime);
    
    const cutoffMinutes = showtime.cutoffMinutes || 5;
    const cutoffTime = new Date(showtimeStart.getTime() - (cutoffMinutes * 60000));
    
    const timeDiff = cutoffTime - currentTime;
    
    if (timeDiff <= 0) return null;
    
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    
    // Also show seconds if less than 10 minutes remaining
    if (hours === 0 && minutes < 10) {
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
      return `${minutes}m ${seconds}s`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const backendUrl = 
        process.env.NODE_ENV === 'production' 
          ? 'https://cinematic-popcorn-theatre-experience-2.onrender.com' 
          : 'http://localhost:5000';
      
      // First, trigger archiving of past showtimes
      console.log("Triggering archive check before fetching movies");
      try {
        await axios.post(`${backendUrl}/api/showtimes/force-archive`, {}, {
          withCredentials: true,
        });
        console.log("Archive process completed");
      } catch (archiveErr) {
        console.error("Error running archive process:", archiveErr);
        // Continue anyway to show available movies
      }
          
      // Now fetch the updated movie list
      const response = await axios.get(`${backendUrl}/api/movies`, {
        withCredentials: true,
      });

      // The response now includes movies with their showtimes
      console.log(`Fetched ${response.data.length} movies`);
      
      // Filter movies to only include those with available (non-archived) showtimes
      const moviesWithShowtimes = response.data.filter(movie => {
        if (!movie.showtimes || movie.showtimes.length === 0) {
          console.log(`Movie ${movie.name} has no showtimes`);
          return false;
        }
        
        // Check if movie has any valid showtimes (non-archived and available for booking)
        const validShowtimes = movie.showtimes.filter(showtime => {
          const isValid = !showtime.isArchived && isShowtimeBookable(showtime);
          if (!isValid) {
            console.log(`Filtering out showtime for ${movie.name}: archived=${showtime.isArchived}, available=${isShowtimeBookable(showtime)}`);
          }
          return isValid;
        });
        
        console.log(`Movie ${movie.name} has ${validShowtimes.length} valid showtimes out of ${movie.showtimes.length} total`);
        return validShowtimes.length > 0;
      });
      
      console.log(`Movies with available showtimes: ${moviesWithShowtimes.length}`);
      
      // If no movies have showtimes, try to reopen archived ones
      if (moviesWithShowtimes.length === 0 && response.data.length > 0) {
        console.log("No movies with available showtimes found. Attempting to reopen archived showtimes...");
        try {
          const reopenResponse = await axios.post(`${backendUrl}/api/showtimes/reopen-all`, {}, {
            withCredentials: true,
          });
          
          if (reopenResponse.data && reopenResponse.data.count > 0) {
            console.log(`Reopened ${reopenResponse.data.count} archived showtimes. Refetching movies...`);
            
            // Refetch movies after reopening
            const refetchResponse = await axios.get(`${backendUrl}/api/movies`, {
              withCredentials: true,
            });
            
            console.log(`After reopening: Fetched ${refetchResponse.data.length} movies`);
            setMovies(refetchResponse.data);
          } else {
            console.log("No archived showtimes found to reopen");
            setMovies(response.data);
          }
        } catch (reopenErr) {
          console.error("Error reopening archived showtimes:", reopenErr);
          setMovies(response.data);
        }
      } else {
        setMovies(response.data);
      }
      
      setError(null);
    } catch (err) {
      console.error("Error fetching movies:", err);
      setError('Failed to fetch movies');
    } finally {
      setLoading(false);
    }
  };
  
  // Refresh data every minute to ensure showtimes are current
  useEffect(() => {
    fetchMovies();
    
    // Set up interval to refresh movies every minute
    const intervalId = setInterval(() => {
      console.log("Running scheduled refresh of movies");
      fetchMovies();
    }, 60000);
    
    // Clean up on unmount
    return () => clearInterval(intervalId);
  }, []);

  const showMovieDetails = (movie) => {
    MySwal.fire({
      title: (
        <div className="flex items-center">
          <FaFilm className="mr-3 text-[#C8A951]" size={24} style={{filter: 'drop-shadow(0 0 3px rgba(200, 169, 81, 0.4))'}} />
          <strong className="font-cinzel text-[#C8A951]" style={{textShadow: '0 0 5px rgba(200, 169, 81, 0.2)'}}>{movie.name}</strong>
        </div>
      ),
      html: (
        <div className="space-y-6 font-poppins">
          <div className="flex items-center">
            <FaTag className="mr-3 text-[#C8A951]" size={20} style={{filter: 'drop-shadow(0 0 3px rgba(200, 169, 81, 0.3))'}} />
            <p><strong className="text-[#C8A951]">Genre:</strong> <span className="text-[#F5F5F5]">{movie.genre}</span></p>
          </div>
          <div className="flex items-center">
            <FaUser className="mr-3 text-[#C8A951]" size={20} style={{filter: 'drop-shadow(0 0 3px rgba(200, 169, 81, 0.3))'}} />
            <p><strong className="text-[#C8A951]">Cast:</strong> <span className="text-[#F5F5F5]">{movie.cast}</span></p>
          </div>
          <div className="flex items-start">
            <FaNewspaper className="mr-3 mt-1 text-[#C8A951]" size={20} style={{filter: 'drop-shadow(0 0 3px rgba(200, 169, 81, 0.3))'}} />
            <p><strong className="text-[#C8A951]">Summary:</strong> <span className="text-[#F5F5F5]">{movie.summary}</span></p>
          </div>
        </div>
      ),
      background: '#0D0D0D',
      color: '#F5F5F5',
      icon: 'info',
      confirmButtonText: 'Close',
      showCloseButton: true,
      closeButtonAriaLabel: 'Close modal',
      customClass: {
        popup: 'animated fadeIn', // Fade-in effect on modal popup
        title: 'text-2xl font-bold',
        htmlContainer: 'p-6 text-lg leading-relaxed',
        icon: 'text-[#C8A951]',
        confirmButton: 'bg-[#0D0D0D] border border-[#C8A951] text-[#F5F5F5] hover:shadow-lg transition-all duration-300',
      },
      didOpen: () => {
        const popup = document.querySelector('.swal2-popup');
        popup.style.transition = 'all 0.5s ease-in-out';
        popup.style.boxShadow = '0 0 30px rgba(0, 0, 0, 0.7), 0 0 15px rgba(200, 169, 81, 0.3)';
        popup.style.border = '1px solid rgba(200, 169, 81, 0.3)';
      },
      willClose: () => {
        const popup = document.querySelector('.swal2-popup');
        popup.style.transition = 'all 0.3s ease-in-out';
      },
    });
  };

  const filteredMovies = movies
    .filter((movie) => {
      // First filter: Only show movies with valid (non-archived) showtimes
      if (!movie.showtimes || movie.showtimes.length === 0) {
        return false;
      }
      
      // Check if movie has any valid showtimes (non-archived and available for booking)
      const validShowtimes = movie.showtimes.filter(showtime => 
        !showtime.isArchived && isShowtimeBookable(showtime)
      );
      
      return validShowtimes.length > 0;
    })
    .filter((movie) => 
      // Second filter: Search query
      movie.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const fontFamily = 'font-sans';

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0D0D0D] text-[#F5F5F5]">
        <div className="flex items-center space-x-4 mb-4">
          <FontAwesomeIcon icon={faTheaterMasks} className="text-6xl text-[#C8A951]" style={{filter: 'drop-shadow(0 0 10px rgba(200, 169, 81, 0.4))'}} />
          <h1 className="text-3xl font-playfair font-semibold text-[#C8A951]" style={{textShadow: '0 0 10px rgba(200, 169, 81, 0.3)'}}>Cinematic Popcorn Park</h1>
        </div>
        <div className="text-center text-2xl font-cinzel text-[#F5F5F5] mt-20 animate-pulse">
          Loading your experience...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0D0D0D] text-[#E50914]">
        <div className="text-center mt-10 font-poppins">
          {error}
        </div>
      </div>
    );
  }

  const handleManualRefresh = async () => {
    setRefreshing(true);
    await fetchMovies();
    setTimeout(() => setRefreshing(false), 1000); // Show refresh animation for at least 1 second
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#F5F5F5] p-6 font-poppins">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <h1 className="text-3xl lg:text-4xl font-playfair font-bold text-center text-[#C8A951] tracking-wide flex items-center justify-center" style={{textShadow: '0 0 10px rgba(200, 169, 81, 0.3)'}}>
          <FontAwesomeIcon icon={faTheaterMasks} className="mr-3 text-[#C8A951]" style={{filter: 'drop-shadow(0 0 5px rgba(200, 169, 81, 0.4))'}} />
          Now Showing
        </h1>
        
        <button 
          onClick={handleManualRefresh}
          disabled={refreshing}
          className={`mt-4 md:mt-0 px-4 py-2 flex items-center justify-center rounded border border-[#C8A951]/30 hover:border-[#C8A951] text-[#C8A951] transition-all duration-300 ${refreshing ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <FontAwesomeIcon 
            icon={faSync} 
            className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} 
            style={{filter: 'drop-shadow(0 0 3px rgba(200, 169, 81, 0.4))'}} 
          />
          {refreshing ? 'Refreshing...' : 'Refresh Showtimes'}
        </button>
      </div>

      {/* Display logged-in user's email */}
      {currentUser && (
        <div className="text-center text-lg mb-8 text-[#C8A951] font-cinzel">
          <p>Welcome, {currentUser.email}</p>
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-10 flex justify-center gap-4">
        <div className="flex items-center bg-[#0D0D0D] border border-[#C8A951]/30 shadow-lg transition-all duration-300 hover:border-[#C8A951]" style={{boxShadow: '0 0 15px rgba(0, 0, 0, 0.4)'}}>
          <FontAwesomeIcon icon={faSearch} className="text-[#C8A951] p-3" style={{filter: 'drop-shadow(0 0 3px rgba(200, 169, 81, 0.3))'}} />
          <input
            type="text"
            placeholder="Search for a movie..."
            className="p-3 bg-[#0D0D0D] text-[#F5F5F5] focus:outline-none transition-all duration-300 ease-in-out w-60 md:w-80 font-poppins"
            style={{boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.2)'}}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredMovies.map((movie) => (
          <div
            key={movie._id}
            className="relative group bg-[#0D0D0D] border border-[#C8A951]/20 overflow-hidden shadow-lg transition-all duration-300 hover:border-[#C8A951]/50"
            style={{boxShadow: '0 0 20px rgba(0, 0, 0, 0.5), 0 0 10px rgba(200, 169, 81, 0.1)'}}
          >
            <div
              className="relative w-auto max-h-fit overflow-hidden cursor-pointer"
              onClick={() => showMovieDetails(movie)}
            >
              <img
                src={imageMap[movie.imageUrl] || 'path/to/default-image.jpg'}
                alt={movie.name || 'Movie Poster'}
                className="w-full h-full object-cover object-center transition-all duration-500 group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-[#0D0D0D]/90 flex gap-3 items-center p-3 border-t border-[#C8A951]/30">
                <div className="flex items-center text-[#C8A951] font-cinzel">
                  <FontAwesomeIcon icon={faStar} className="mr-2" style={{filter: 'drop-shadow(0 0 3px rgba(200, 169, 81, 0.4))'}} />
                  {movie.ratings}
                </div>
                <div className="flex items-center text-[#E50914] font-cinzel">
                  <FontAwesomeIcon icon={faThumbsUp} className="mr-2" style={{filter: 'drop-shadow(0 0 3px rgba(229, 9, 20, 0.4))'}} />
                  {movie.votes} Votes
                </div>
              </div>
            </div>

            <div className="p-5 text-[#F5F5F5] text-sm md:text-base space-y-4 font-poppins">
              <p className="text-xl md:text-2xl font-bold text-[#C8A951] flex items-center gap-3 font-cinzel" style={{textShadow: '0 0 5px rgba(200, 169, 81, 0.2)'}}>
                <FontAwesomeIcon icon={faFilm} className="text-[#C8A951]" />
                {movie.name}
              </p>
              
              {/* Show screen and timing from showtimes if available */}
              {(() => {
                // Get the first valid (non-archived and bookable) showtime
                const validShowtimes = movie.showtimes?.filter(showtime => 
                  !showtime.isArchived && isShowtimeBookable(showtime)
                );
                const firstValidShowtime = validShowtimes?.[0];
                
                return firstValidShowtime && typeof firstValidShowtime === 'object' ? (
                <div className="space-y-2">
                  <p className="text-base md:text-lg font-medium text-[#F5F5F5] flex items-center gap-3">
                    <FontAwesomeIcon icon={faTv} className="text-[#C8A951]" />
                    Screen: <span className="font-semibold">{firstValidShowtime.screen}</span>
                  </p>
                  <p className="text-base md:text-lg font-medium text-[#F5F5F5] flex items-center gap-3">
                    <FontAwesomeIcon icon={faClock} className="text-[#C8A951]" />
                    Show Time: <span className="font-semibold">
                      {new Date(firstValidShowtime.startTime).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })} - {new Date(firstValidShowtime.endTime).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </span>
                  </p>
                  <p className="text-base md:text-lg font-medium text-[#F5F5F5] flex items-center gap-3">
                    <FontAwesomeIcon icon={faLanguage} className="text-[#C8A951]" />
                    Language: <span className="font-semibold">{movie.language}</span>
                  </p>
                  
                  {/* Time slot category */}
                  <div className="flex items-center gap-3">
                    <FontAwesomeIcon icon={faTheaterMasks} className="text-[#C8A951]" />
                    <span className="text-base md:text-lg font-medium text-[#F5F5F5]">
                      Time Slot: 
                      <span className={`font-semibold ml-1 px-2 py-1 rounded-md text-sm ${
                        firstValidShowtime.screen === 'Screen 1' 
                          ? 'bg-yellow-600/20 text-yellow-300' // Morning
                          : firstValidShowtime.screen === 'Screen 2'
                          ? 'bg-orange-600/20 text-orange-300' // Afternoon
                          : 'bg-purple-600/20 text-purple-300' // Night
                      }`}>
                        {firstValidShowtime.screen === 'Screen 1' 
                          ? '🌅 Morning Show' 
                          : firstValidShowtime.screen === 'Screen 2'
                          ? '🌞 Afternoon Show'
                          : '🌙 Night Show'
                        }
                      </span>
                    </span>
                  </div>
                </div>
              ) : (
                /* Fallback to movie properties if showtimes not available */
                <div className="space-y-2">
                  <p className="text-base md:text-lg font-medium text-[#F5F5F5] flex items-center gap-3">
                    <FontAwesomeIcon icon={faTv} className="text-[#C8A951]" />
                    Screen: <span className="font-semibold">{movie.screen || 'TBA'}</span>
                  </p>
                  <p className="text-base md:text-lg font-medium text-[#F5F5F5] flex items-center gap-3">
                    <FontAwesomeIcon icon={faClock} className="text-[#C8A951]" />
                    Timing: <span className="font-semibold">{movie.timing || 'TBA'}</span>
                  </p>
                  <p className="text-base md:text-lg font-medium text-[#F5F5F5] flex items-center gap-3">
                    <FontAwesomeIcon icon={faLanguage} className="text-[#C8A951]" />
                    Language: <span className="font-semibold">{movie.language}</span>
                  </p>
                </div>
              );
              })()}
            </div>

            <div className="px-5 pb-5 text-center flex flex-col gap-3">
              {/* Primary: Real-time booking button with cutoff validation */}
              {(() => {
                // Get the first valid (non-archived and bookable) showtime
                const validShowtimes = movie.showtimes?.filter(showtime => 
                  !showtime.isArchived && isShowtimeBookable(showtime)
                );
                const firstValidShowtime = validShowtimes?.[0];
                
                if (!firstValidShowtime) {
                  return (
                    <div className="space-y-2">
                      <button
                        className="bg-gray-600 border-2 border-gray-500 text-gray-300 font-playfair font-semibold py-3 px-6 cursor-not-allowed w-full flex items-center justify-center"
                        disabled
                      >
                        <span className="mr-2">No Available Showtimes</span>
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      </button>
                    </div>
                  );
                }
                
                const showtimeId = firstValidShowtime._id;
                const isBookable = isShowtimeBookable(firstValidShowtime);
                const timeRemaining = getTimeUntilCutoff(firstValidShowtime);
                  
                  if (!isBookable) {
                    return (
                      <div className="space-y-2">
                        <button
                          className="bg-gray-600 border-2 border-gray-500 text-gray-300 font-playfair font-semibold py-3 px-6 cursor-not-allowed w-full flex items-center justify-center"
                          disabled
                        >
                          <span className="mr-2">Booking Closed</span>
                          <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        </button>
                        <p className="text-red-400 text-sm font-poppins">
                          {firstValidShowtime ? (
                            firstValidShowtime.isArchived ? 'Show has been archived' :
                            new Date() > new Date(firstValidShowtime.endTime) ? 'Show has ended' :
                            new Date() > new Date(firstValidShowtime.startTime) ? 'Show has started' :
                            'Booking cutoff time passed'
                          ) : 'Not available for booking'}
                        </p>
                      </div>
                    );
                  }
                  
                  return (
                    <div className="space-y-2">
                      <Link to={`/tickets/${movie._id}/${showtimeId}`}>
                        <button
                          className="bg-[#0D0D0D] border-2 border-[#C8A951] text-[#F5F5F5] font-playfair font-semibold py-3 px-6 transition-all duration-300 hover:shadow-lg w-full flex items-center justify-center"
                          style={{boxShadow: '0 0 15px rgba(200, 169, 81, 0.3)'}}
                        >
                          <span className="mr-2">Book Now</span>
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        </button>
                      </Link>
                      {timeRemaining && (
                        <p className="text-yellow-400 text-xs font-poppins">
                          ⏰ Booking closes in {timeRemaining}
                        </p>
                      )}
                    </div>
                  );
              })()}
            </div>
          </div>
        ))}
      </div>

      <Footer />
    </div>
  );
};

export default Home;
