import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOut,
} from '../redux/user/userSlice';
import { 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaTrashAlt, 
  FaSignOutAlt,
  FaTicketAlt,
  FaSpinner,
  FaExclamationCircle,
  FaCalendar,
  FaFilm,
  FaClock,
  FaChair,
  FaCar,
  FaCog,
  FaPhone,
  FaCheckCircle,
  FaTimesCircle
} from 'react-icons/fa';

// Import the shared movie image utility
import { getMovieImage } from '../utils/movieImages';

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    username: currentUser?.username || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    password: '',
  });
  
  // Bookings state
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  const [activeTab, setActiveTab] = useState('profile'); // profile, bookings
  
  // API base URL
  const backendUrl = 
    process.env.NODE_ENV === 'production' 
      ? 'https://cinematic-popcorn-theatre-experience-2.onrender.com' 
      : 'http://localhost:5000';

  useEffect(() => {
    setUpdateSuccess(false); 
  }, []);
  
  // Fetch user's bookings
  useEffect(() => {
    if (activeTab === 'bookings' && currentUser) {
      fetchBookings();
    }
  }, [activeTab, currentUser]);

  const fetchBookings = async () => {
    if (!currentUser) return;
    
    setLoadingBookings(true);
    setBookingError(null);
    
    try {
      const response = await axios.get(
        `${backendUrl}/api/user/${currentUser._id}`,
        { withCredentials: true }
      );
      
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setBookingError(error.response?.data?.message || error.message || 'Failed to fetch bookings');
    } finally {
      setLoadingBookings(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`${backendUrl}/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });
      
      const data = await res.json();
      
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
      
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (!confirmDelete) return;

    try {
      dispatch(deleteUserStart());
      const res = await fetch(`${backendUrl}/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      const data = await res.json();
      
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      
      dispatch(deleteUserSuccess(data));
      navigate('/');
      
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch(`${backendUrl}/api/auth/signout`, {
        credentials: 'include',
      });
      
      dispatch(signOut());
      navigate('/sign-in');
      
    } catch (error) {
      console.log(error);
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  // Format time for display
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#F5F5F5] pt-20">
      <div className="max-w-6xl mx-auto p-4 flex flex-col lg:flex-row gap-6">
        
        {/* Sidebar */}
        <div className="w-full lg:w-1/4">
          <div className="bg-[#0D0D0D] border border-[#C8A951]/30 p-6 shadow-lg" 
               style={{boxShadow: '0 0 25px rgba(0, 0, 0, 0.7), 0 0 15px rgba(200, 169, 81, 0.2)'}}>
            
            {/* User Avatar */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#C8A951] to-[#DFBD69] flex items-center justify-center text-[#0D0D0D] text-2xl font-bold mb-3"
                   style={{boxShadow: '0 0 15px rgba(200, 169, 81, 0.3)'}}>
                {currentUser?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <h2 className="text-xl font-playfair font-semibold text-[#C8A951]">{currentUser?.username}</h2>
              <p className="text-[#F5F5F5]/70 text-sm font-poppins">{currentUser?.email}</p>
            </div>
            
            {/* Navigation Tabs */}
            <div className="space-y-3">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full py-3 px-4 text-left flex items-center font-poppins transition-all duration-300 border-l-4 ${
                  activeTab === 'profile' 
                    ? 'bg-[#C8A951]/20 text-[#C8A951] border-[#C8A951]' 
                    : 'text-[#F5F5F5]/70 hover:text-[#C8A951] hover:bg-[#C8A951]/10 border-transparent'
                }`}
                style={activeTab === 'profile' ? {boxShadow: '0 0 10px rgba(200, 169, 81, 0.2)'} : {}}
              >
                <FaCog className="mr-3" />
                Profile Settings
              </button>
              
              <button
                onClick={() => setActiveTab('bookings')}
                className={`w-full py-3 px-4 text-left flex items-center font-poppins transition-all duration-300 border-l-4 ${
                  activeTab === 'bookings' 
                    ? 'bg-[#C8A951]/20 text-[#C8A951] border-[#C8A951]' 
                    : 'text-[#F5F5F5]/70 hover:text-[#C8A951] hover:bg-[#C8A951]/10 border-transparent'
                }`}
                style={activeTab === 'bookings' ? {boxShadow: '0 0 10px rgba(200, 169, 81, 0.2)'} : {}}
              >
                <FaTicketAlt className="mr-3" />
                My Bookings
              </button>
              
              <button
                onClick={handleSignOut}
                className="w-full py-3 px-4 text-left flex items-center font-poppins text-[#E50914] hover:bg-[#E50914]/10 transition-all duration-300 border-l-4 border-transparent hover:border-[#E50914]"
              >
                <FaSignOutAlt className="mr-3" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="w-full lg:w-3/4">
          
          {/* Profile Settings Tab */}
          {activeTab === 'profile' && (
            <div className="bg-[#0D0D0D] border border-[#C8A951]/30 p-6 shadow-lg"
                 style={{boxShadow: '0 0 25px rgba(0, 0, 0, 0.7), 0 0 15px rgba(200, 169, 81, 0.2)'}}>
              
              <h1 className="text-3xl font-playfair font-semibold text-[#C8A951] mb-6" 
                  style={{textShadow: '0 0 10px rgba(200, 169, 81, 0.3)'}}>
                Profile Settings
              </h1>
              
              <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                <img
                  src={currentUser?.profilePicture || 'default-profile.png'}
                  alt="profile"
                  className="h-24 w-24 self-center cursor-pointer object-cover mt-2 border-2 border-[#C8A951] shadow-md transition-transform duration-300 hover:scale-105"
                  style={{boxShadow: '0 0 15px rgba(200, 169, 81, 0.3)'}}
                />
                
                <div className="flex items-center border-b border-[#C8A951]/30 focus-within:border-[#C8A951] transition duration-300 pb-1">
                  <FaUser className="text-[#C8A951] mr-3" style={{filter: 'drop-shadow(0 0 3px rgba(200, 169, 81, 0.3))'}} />
                  <input
                    type="text"
                    id="username"
                    placeholder="Username"
                    className="bg-[#0D0D0D] p-3 w-full focus:outline-none transition duration-300 text-[#F5F5F5] font-poppins"
                    style={{boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.3)'}}
                    defaultValue={currentUser?.username}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="flex items-center border-b border-[#C8A951]/30 focus-within:border-[#C8A951] transition duration-300 pb-1">
                  <FaEnvelope className="text-[#C8A951] mr-3" style={{filter: 'drop-shadow(0 0 3px rgba(200, 169, 81, 0.3))'}} />
                  <input
                    type="email"
                    id="email"
                    placeholder="Email"
                    className="bg-[#0D0D0D] p-3 w-full focus:outline-none transition duration-300 text-[#F5F5F5] font-poppins"
                    style={{boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.3)'}}
                    defaultValue={currentUser?.email}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="flex items-center border-b border-[#C8A951]/30 focus-within:border-[#C8A951] transition duration-300 pb-1">
                  <FaPhone className="text-[#C8A951] mr-3" style={{filter: 'drop-shadow(0 0 3px rgba(200, 169, 81, 0.3))'}} />
                  <input
                    type="tel"
                    id="phone"
                    placeholder="Phone Number"
                    className="bg-[#0D0D0D] p-3 w-full focus:outline-none transition duration-300 text-[#F5F5F5] font-poppins"
                    style={{boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.3)'}}
                    defaultValue={currentUser?.phone}
                    onChange={handleChange}
                  />
                  {currentUser?.phoneVerified && (
                    <FaCheckCircle className="text-green-500 ml-2" title="Phone Verified" />
                  )}
                  {currentUser?.phone && !currentUser?.phoneVerified && (
                    <FaTimesCircle className="text-red-500 ml-2" title="Phone Not Verified" />
                  )}
                </div>
                
                {/* Phone Verification Status */}
                {currentUser?.phone && !currentUser?.phoneVerified && (
                  <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-3 mb-4">
                    <p className="text-yellow-400 text-sm mb-2">
                      <FaExclamationCircle className="inline mr-2" />
                      Your phone number is not verified. Verify it during booking or update it here to verify.
                    </p>
                  </div>
                )}
                
                {currentUser?.phoneVerified && (
                  <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-3 mb-4">
                    <p className="text-green-400 text-sm">
                      <FaCheckCircle className="inline mr-2" />
                      Your phone number is verified and ready for bookings!
                    </p>
                  </div>
                )}
                
                <div className="flex items-center border-b border-[#C8A951]/30 focus-within:border-[#C8A951] transition duration-300 pb-1">
                  <FaLock className="text-[#C8A951] mr-3" style={{filter: 'drop-shadow(0 0 3px rgba(200, 169, 81, 0.3))'}} />
                  <input
                    type="password"
                    id="password"
                    placeholder="New Password (optional)"
                    className="bg-[#0D0D0D] p-3 w-full focus:outline-none transition duration-300 text-[#F5F5F5] font-poppins"
                    style={{boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.3)'}}
                    onChange={handleChange}
                  />
                </div>
                
                <button 
                  className="bg-[#0D0D0D] border border-[#C8A951] text-[#F5F5F5] py-3 uppercase font-cinzel transition-all duration-300 hover:bg-[#C8A951] hover:text-[#0D0D0D] disabled:opacity-50" 
                  style={{boxShadow: '0 0 10px rgba(200, 169, 81, 0.2)'}}
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Update Profile'}
                </button>
              </form>
              
              {/* Messages */}
              <div className="mt-6 space-y-2">
                {error && <p className="text-[#E50914] font-poppins">{error}</p>}
                {updateSuccess && <p className="text-[#C8A951] font-poppins">Profile updated successfully!</p>}
              </div>
              
              {/* Delete Account */}
              <div className="mt-8 pt-6 border-t border-[#C8A951]/30">
                <button
                  onClick={handleDeleteAccount}
                  className="flex items-center text-[#E50914] hover:text-[#E50914]/80 transition duration-300 font-poppins"
                >
                  <FaTrashAlt className="mr-2" />
                  Delete Account
                </button>
              </div>
            </div>
          )}
          
          {/* My Bookings Tab */}
          {activeTab === 'bookings' && (
            <div className="bg-[#0D0D0D] border border-[#C8A951]/30 shadow-lg"
                 style={{boxShadow: '0 0 25px rgba(0, 0, 0, 0.7), 0 0 15px rgba(200, 169, 81, 0.2)'}}>
              
              <div className="p-6 border-b border-[#C8A951]/30">
                <h1 className="text-3xl font-playfair font-semibold text-[#C8A951]" 
                    style={{textShadow: '0 0 10px rgba(200, 169, 81, 0.3)'}}>
                  My Bookings
                </h1>
              </div>
              
              {loadingBookings ? (
                <div className="flex items-center justify-center py-12">
                  <FaSpinner className="animate-spin text-[#C8A951] text-3xl" />
                  <span className="ml-3 text-[#F5F5F5] font-poppins">Loading bookings...</span>
                </div>
              ) : bookingError ? (
                <div className="p-6 text-center">
                  <FaExclamationCircle className="text-[#E50914] text-4xl mb-4 mx-auto" />
                  <p className="text-[#E50914] font-poppins text-lg mb-4">{bookingError}</p>
                  <button 
                    onClick={fetchBookings}
                    className="bg-[#C8A951] text-[#0D0D0D] px-6 py-2 font-poppins hover:bg-[#DFBD69] transition duration-300"
                  >
                    Try Again
                  </button>
                </div>
              ) : bookings.length === 0 ? (
                <div className="p-8 text-center">
                  <FaTicketAlt className="text-[#C8A951]/50 text-6xl mb-4 mx-auto" />
                  <p className="text-[#F5F5F5]/70 font-poppins text-lg mb-4">You haven't made any bookings yet.</p>
                  <button 
                    onClick={() => navigate('/')}
                    className="bg-[#C8A951] text-[#0D0D0D] px-6 py-3 font-poppins hover:bg-[#DFBD69] transition duration-300"
                    style={{boxShadow: '0 0 10px rgba(200, 169, 81, 0.3)'}}
                  >
                    Browse Movies
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-[#C8A951]/20">
                  {bookings.map(booking => (
                    <div key={booking._id} className="p-6 hover:bg-[#C8A951]/5 transition-all duration-300">
                      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                        
                        {/* Movie Image */}
                        <div className="flex-shrink-0">
                          <img 
                            src={getMovieImage(booking.movieId)} 
                            alt={booking.movieId?.name || 'Movie'}
                            className="w-16 h-20 lg:w-20 lg:h-28 object-cover rounded-lg shadow-md border border-[#C8A951]/20"
                            onError={(e) => {
                              e.target.src = '/src/images/new.jpg';
                            }}
                          />
                        </div>
                        
                        {/* Booking Details */}
                        <div className="flex-1">
                          <h3 className="text-xl font-playfair font-bold text-[#C8A951] mb-2" 
                              style={{textShadow: '0 0 5px rgba(200, 169, 81, 0.3)'}}>
                            {booking.movieId?.name || 'Movie Name'}
                          </h3>
                          
                          {/* Movie Genre and Duration */}
                          {(booking.movieId?.genre || booking.movieId?.duration) && (
                            <div className="flex flex-wrap gap-2 mb-3">
                              {booking.movieId?.genre && (
                                <span className="px-2 py-1 bg-[#C8A951] text-[#0D0D0D] text-xs rounded-full">
                                  {booking.movieId.genre}
                                </span>
                              )}
                              {booking.movieId?.duration && (
                                <span className="px-2 py-1 bg-[#1A1A1A] border border-[#C8A951]/30 text-[#F5F5F5] text-xs rounded-full">
                                  {booking.movieId.duration} min
                                </span>
                              )}
                            </div>
                          )}
                          
                          <div className="text-sm text-[#F5F5F5]/70 space-y-2 mb-4 font-poppins">
                            <p className="flex items-center">
                              <FaCalendar className="mr-2 text-[#C8A951]" />
                              {formatDate(booking.showtimeId?.date || booking.createdAt)}
                            </p>
                            <p className="flex items-center">
                              <FaClock className="mr-2 text-[#C8A951]" />
                              {formatTime(booking.showtimeId?.startTime || booking.createdAt)}
                            </p>
                            <p className="flex items-center">
                              <FaFilm className="mr-2 text-[#C8A951]" />
                              {booking.showtimeId?.screen || 'Screen 1'}
                            </p>
                          </div>
                          
                          <div className="space-y-2">
                            <p className="flex items-center font-poppins">
                              <FaChair className="mr-2 text-[#C8A951]" />
                              <span className="font-medium text-[#F5F5F5] mr-2">Seats:</span>
                              <span className="text-[#C8A951]">
                                {booking.seats?.map(seat => seat.seatNumber || seat.number).join(', ') || 'N/A'}
                              </span>
                            </p>
                            
                            {booking.parkingSlots && booking.parkingSlots.length > 0 && (
                              <p className="flex items-center font-poppins">
                                <FaCar className="mr-2 text-[#C8A951]" />
                                <span className="font-medium text-[#F5F5F5] mr-2">Parking:</span>
                                <span className="text-[#C8A951]">
                                  {booking.parkingSlots.map(slot => slot.slotNumber || slot.number).join(', ')}
                                </span>
                              </p>
                            )}
                            
                            {booking.phone && (
                              <p className="flex items-center font-poppins">
                                <FaPhone className="mr-2 text-[#C8A951]" />
                                <span className="font-medium text-[#F5F5F5] mr-2">Contact:</span>
                                <span className="text-[#C8A951]">{booking.phone}</span>
                                {booking.phoneVerified && (
                                  <FaCheckCircle className="ml-2 text-green-500" title="Phone Verified" />
                                )}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        {/* Booking Summary */}
                        <div className="bg-[#C8A951]/10 border border-[#C8A951]/30 p-4 lg:min-w-[250px]" 
                             style={{boxShadow: '0 0 10px rgba(200, 169, 81, 0.1)'}}>
                          <div className="space-y-2 text-sm font-poppins">
                            <p className="flex justify-between">
                              <span className="text-[#F5F5F5]/70">Booking Ref:</span>
                              <span className="text-[#C8A951] font-mono">{booking.bookingReference}</span>
                            </p>
                            <p className="flex justify-between">
                              <span className="text-[#F5F5F5]/70">Amount:</span>
                              <span className="text-[#C8A951] font-bold">₹{booking.totalCost}</span>
                            </p>
                            <p className="flex justify-between">
                              <span className="text-[#F5F5F5]/70">Status:</span>
                              <span className={`font-bold ${booking.paymentStatus === 'Paid' ? 'text-green-400' : 'text-yellow-400'}`}>
                                {booking.paymentStatus}
                              </span>
                            </p>
                            <p className="text-[#F5F5F5]/50 text-xs pt-2 border-t border-[#C8A951]/20">
                              Booked on {new Date(booking.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
