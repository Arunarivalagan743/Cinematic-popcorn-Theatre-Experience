import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserSuccess } from '../redux/user/userSlice';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faDollarSign, 
  faCar, 
  faMotorcycle, 
  faSpinner, 
  faExclamationCircle, 
  faCheckCircle,
  faCouch,
  faChair,
  faFilm,
  faClock,
  faUsers,
  faLock,
  faLockOpen,
  faShield,
  faKey
} from '@fortawesome/free-solid-svg-icons';
import { 
  connectSocket, 
  joinShowtimeRoom, 
  leaveShowtimeRoom, 
  useSocket,
  holdSeat,
  releaseSeat,
  holdParkingSlot,
  releaseParkingSlot
} from '../services/socketService';
import { auth } from '../firebase';
import { 
  RecaptchaVerifier, 
  signInWithPhoneNumber, 
  PhoneAuthProvider, 
  signInWithCredential 
} from 'firebase/auth';

// Import the shared movie image utility
import { getMovieImage } from '../utils/movieImages';

const Tickets = () => {
  const { movieId, showtimeId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  
  // Reference for selected seats to use in effects
  const selectedSeatsRef = useRef([]);
  const selectedParkingRef = useRef({ twoWheeler: [], fourWheeler: [] });
  
  // State for data fetching
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showtimeData, setShowtimeData] = useState(null);
  const [movieData, setMovieData] = useState(null);
  const [seats, setSeats] = useState([]);
  const [parkingSlots, setParkingSlots] = useState({
    twoWheeler: [],
    fourWheeler: []
  });
  
  // State for user selections
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [parkingNeeded, setParkingNeeded] = useState(false);
  const [selectedTwoWheelerSlots, setSelectedTwoWheelerSlots] = useState([]);
  const [selectedFourWheelerSlots, setSelectedFourWheelerSlots] = useState([]);
  const [phone, setPhone] = useState("");
  const [vehicleNumbers, setVehicleNumbers] = useState({ twoWheeler: [], fourWheeler: [] });
  
  // OTP verification states
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOtpVerifying, setIsOtpVerifying] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState(null);
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  
  // Test mode for development (set to false for production)
  const TEST_MODE = import.meta.env.MODE === 'development';
  
  // Constants - All seats are now ₹150
  const SEAT_PRICE = {
    STANDARD: 150,
    PREMIUM: 150,
    VIP: 150
  };
  const TWO_WHEELER_PRICE = 50;
  const FOUR_WHEELER_PRICE = 100;
  
  // Calculate parking cost
  const parkingCost = selectedTwoWheelerSlots.length * TWO_WHEELER_PRICE + 
                     selectedFourWheelerSlots.length * FOUR_WHEELER_PRICE;
  
  // API base URL
  const backendUrl = 
    process.env.NODE_ENV === 'production' 
      ? 'https://cinematic-popcorn-theatre-experience-2.onrender.com' 
      : 'http://localhost:5000';
  
  // Setup socket connection with event handlers
  const { socket, isConnected } = useSocket([
    { 
      event: 'seatsUpdated', 
      handler: ({ seats: updatedSeats }) => {
        if (!Array.isArray(updatedSeats)) {
          console.error("Received non-array seats update from socket:", updatedSeats);
          return;
        }
        
        setSeats(prevSeats => {
          if (!Array.isArray(prevSeats) || prevSeats.length === 0) return updatedSeats;
          
          return prevSeats.map(seat => {
            const updatedSeat = updatedSeats.find(us => us._id === seat._id);
            return updatedSeat ? updatedSeat : seat;
          });
        });
      }
    },
    { 
      event: 'parkingUpdated', 
      handler: ({ parkingSlots: updatedSlots }) => {
        setParkingSlots(prev => {
          const twoWheelers = prev.twoWheeler.map(slot => {
            const updated = updatedSlots.find(us => us._id === slot._id && us.type === 'twoWheeler');
            return updated ? updated : slot;
          });
          
          const fourWheelers = prev.fourWheeler.map(slot => {
            const updated = updatedSlots.find(us => us._id === slot._id && us.type === 'fourWheeler');
            return updated ? updated : slot;
          });
          
          return {
            twoWheeler: twoWheelers,
            fourWheeler: fourWheelers
          };
        });
      }
    },
    { 
      event: 'holdExpired', 
      handler: ({ type, itemId }) => {
        // Handle expired holds
        if (type === 'seat') {
          setSelectedSeats(prev => prev.filter(seat => seat._id !== itemId));
        } else if (type === 'twoWheeler') {
          setSelectedTwoWheelerSlots(prev => prev.filter(slot => slot._id !== itemId));
        } else if (type === 'fourWheeler') {
          setSelectedFourWheelerSlots(prev => prev.filter(slot => slot._id !== itemId));
        }
        
        // Show notification
        Swal.fire({
          title: 'Hold Expired',
          text: `Your hold on a ${type === 'seat' ? 'seat' : 'parking slot'} has expired.`,
          icon: 'warning',
          timer: 3000,
          timerProgressBar: true
        });
      }
    }
  ]);
  
  // Calculate total cost based on selected seats and parking
  useEffect(() => {
    // Calculate seat cost
    const seatCost = Array.isArray(selectedSeats) ? selectedSeats.reduce((acc, seat) => {
      return acc + (SEAT_PRICE[seat.category] || SEAT_PRICE.STANDARD);
    }, 0) : 0;
    
    // Add parking cost
    setTotalCost(seatCost + parkingCost);
    
    // Update refs for use in cleanup
    selectedSeatsRef.current = selectedSeats;
    selectedParkingRef.current = {
      twoWheeler: selectedTwoWheelerSlots,
      fourWheeler: selectedFourWheelerSlots
    };
  }, [selectedSeats, selectedTwoWheelerSlots, selectedFourWheelerSlots, parkingCost]);

  // Initial data loading
  useEffect(() => {
    // Check for valid params
    if (!movieId || !showtimeId || movieId === 'undefined' || showtimeId === 'undefined') {
      console.error('Invalid movieId or showtimeId', { movieId, showtimeId });
      setError('Invalid movie or showtime information. Please go back and try again.');
      setLoading(false);
      
      // Show error modal with redirect option
      Swal.fire({
        title: 'Error',
        text: 'There was a problem loading the booking information. Would you like to return to the homepage?',
        icon: 'error',
        showCancelButton: true,
        confirmButtonText: 'Return to Homepage',
        cancelButtonText: 'Stay Here'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/');
        }
      });
      return;
    }
    
    // Fetch data
    fetchData();
    
    // Cleanup function
    return () => {
      // Release all held seats and parking slots
      selectedSeatsRef.current.forEach(seat => {
        releaseSeat(showtimeId, seat._id);
      });
      
      selectedParkingRef.current.twoWheeler.forEach(slot => {
        releaseParkingSlot(showtimeId, slot._id);
      });
      
      selectedParkingRef.current.fourWheeler.forEach(slot => {
        releaseParkingSlot(showtimeId, slot._id);
      });
      
      // Leave the showtime room
      leaveShowtimeRoom(showtimeId);
    };
  }, [movieId, showtimeId]);
  
  // Join showtime room when data is loaded
  useEffect(() => {
    if (showtimeData?._id) {
      joinShowtimeRoom(showtimeData._id);
    }
  }, [showtimeData]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Double-check IDs before making requests
      if (!movieId || movieId === 'undefined' || !showtimeId || showtimeId === 'undefined') {
        throw new Error('Invalid movie or showtime ID');
      }
      
      // Fetch showtime data
      const showtimeRes = await axios.get(`${backendUrl}/api/showtimes/${showtimeId}`, {
        withCredentials: true
      });
      setShowtimeData(showtimeRes.data);
      
      // Fetch movie data
      const movieRes = await axios.get(`${backendUrl}/api/movies/${movieId}`, {
        withCredentials: true
      });
      setMovieData(movieRes.data);
      
      // Fetch seats for this showtime
      const seatsRes = await axios.get(`${backendUrl}/api/seats/showtime/${showtimeId}`, {
        withCredentials: true
      });
      console.log('Seats fetched from API:', seatsRes.data);
      console.log('Number of seats:', seatsRes.data.length);
      setSeats(seatsRes.data);
      
      // Fetch parking slots for this showtime
      const parkingRes = await axios.get(`${backendUrl}/api/parking/showtime/${showtimeId}`, {
        withCredentials: true
      });
      setParkingSlots({
        twoWheeler: parkingRes.data.twoWheelerSlots || [],
        fourWheeler: parkingRes.data.fourWheelerSlots || []
      });
      
    } catch (err) {
      console.error('Error fetching data:', err);
      
      // Determine the specific error message
      let errorMessage = 'An error occurred while fetching data.';
      if (err.message === 'Invalid movie or showtime ID') {
        errorMessage = 'Invalid booking information. Please return to the homepage and try again.';
      } else if (err.response?.status === 404) {
        // Handle 404 errors specifically
        if (err.config?.url?.includes('/api/movies/')) {
          errorMessage = 'The selected movie could not be found. It may have been removed from our system.';
        } else if (err.config?.url?.includes('/api/showtimes/')) {
          errorMessage = 'The selected showtime is no longer available. Please choose another showtime.';
        }
      } else {
        errorMessage = err.response?.data?.message || errorMessage;
      }
      
      setError(errorMessage);
      
      // Add a button to return to homepage
      Swal.fire({
        title: 'Booking Error',
        text: errorMessage + ' Would you like to return to the homepage?',
        icon: 'error',
        showCancelButton: true,
        confirmButtonText: 'Return to Homepage',
        cancelButtonText: 'Stay Here'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/');
        }
      });
    } finally {
      setLoading(false);
    }
  };

  // Setup reCAPTCHA verifier
  useEffect(() => {
    const setupRecaptcha = () => {
      try {
        if (!recaptchaVerifier) {
          // Wait for the container to exist in DOM
          const container = document.getElementById('recaptcha-container');
          if (!container) {
            console.warn('reCAPTCHA container not ready yet, retrying...');
            // Retry after a short delay
            setTimeout(setupRecaptcha, 500);
            return;
          }
          
          const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            size: 'invisible',
            callback: () => {
              console.log('reCAPTCHA solved');
            },
            'expired-callback': () => {
              console.log('reCAPTCHA expired');
            }
          });
          setRecaptchaVerifier(verifier);
          console.log('reCAPTCHA verifier created successfully');
        }
      } catch (error) {
        console.error('Error setting up reCAPTCHA:', error);
        // Don't show error popup for reCAPTCHA setup issues in development
        if (process.env.NODE_ENV === 'production') {
          Swal.fire({
            title: 'Verification Setup Error',
            text: 'Failed to initialize phone verification. Please refresh the page.',
            icon: 'error',
            confirmButtonColor: '#C8A951'
          });
        }
      }
    };

    // Delay setup to ensure DOM is ready
    setTimeout(setupRecaptcha, 1500);

    // Cleanup
    return () => {
      if (recaptchaVerifier) {
        try {
          recaptchaVerifier.clear();
        } catch (error) {
          console.error('Error clearing reCAPTCHA:', error);
        }
      }
    };
  }, []);

  // Send OTP to phone number with email fallback
  const sendOTP = async () => {
    if (!phone || phone.trim() === '') {
      Swal.fire({
        title: 'Phone Number Required',
        text: 'Please enter your phone number first.',
        icon: 'warning',
        confirmButtonColor: '#C8A951'
      });
      return;
    }

    // Format phone number for Firebase (add country code if not present)
    let formattedPhone = phone.trim();
    if (!formattedPhone.startsWith('+')) {
      formattedPhone = '+91' + formattedPhone; // Default to India
    }

    // Basic phone number validation
    const phoneRegex = /^\+\d{10,15}$/;
    if (!phoneRegex.test(formattedPhone)) {
      Swal.fire({
        title: 'Invalid Phone Number',
        text: 'Please enter a valid phone number (10 digits).',
        icon: 'error',
        confirmButtonColor: '#C8A951'
      });
      return;
    }

    setIsOtpLoading(true);

    try {
      // Test mode for development
      if (TEST_MODE) {
        console.log('TEST MODE: Simulating OTP send');
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
        setIsOtpSent(true);
        setConfirmationResult({ testMode: true, phone: formattedPhone });
        
        Swal.fire({
          title: 'OTP Sent! (Test Mode)',
          text: `Test OTP: 123456 (for ${formattedPhone})`,
          icon: 'success',
          confirmButtonColor: '#C8A951'
        });
        return;
      }

      // Production mode with real Firebase - try phone first
      let otpSentViaPhone = false;
      
      try {
        // Ensure reCAPTCHA is ready
        if (!recaptchaVerifier) {
          console.log('reCAPTCHA not found, creating new one...');
          const container = document.getElementById('recaptcha-container');
          if (!container) {
            throw new Error('reCAPTCHA container not found');
          }
          
          const newVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            size: 'invisible',
            callback: () => {
              console.log('reCAPTCHA solved');
            }
          });
          setRecaptchaVerifier(newVerifier);
          
          // Wait a moment for the verifier to be ready
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const result = await signInWithPhoneNumber(auth, formattedPhone, newVerifier);
          setConfirmationResult(result);
          otpSentViaPhone = true;
        } else {
          const result = await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifier);
          setConfirmationResult(result);
          otpSentViaPhone = true;
        }
      } catch (firebaseError) {
        console.error('Firebase OTP failed:', firebaseError);
        
        // Check if it's a billing error or other Firebase issues
        if (firebaseError.code === 'auth/billing-not-enabled' || 
            firebaseError.code === 'auth/quota-exceeded' ||
            firebaseError.message?.includes('billing')) {
          console.log('Firebase billing issue detected, falling back to email OTP...');
          
          // Fallback to email-based OTP
          try {
            const backendUrl = 
              process.env.NODE_ENV === 'production' 
                ? 'https://cinematic-popcorn-theatre-experience-2.onrender.com' 
                : 'http://localhost:5000';
            
            const emailOtpResponse = await axios.post(`${backendUrl}/api/auth/send-email-otp`, {
              phone: formattedPhone,
              email: currentUser?.email || 'fallback@example.com'
            }, {
              withCredentials: true
            });
            
            if (emailOtpResponse.data.success) {
              setConfirmationResult({ 
                emailMode: true, 
                phone: formattedPhone,
                otpId: emailOtpResponse.data.otpId 
              });
              otpSentViaPhone = false; // Using email fallback
              
              Swal.fire({
                title: 'OTP Sent via Email!',
                html: `
                  <p>Phone verification is temporarily unavailable.</p>
                  <p>We've sent a verification code to your registered email address:</p>
                  <p><strong>${currentUser?.email || 'your email'}</strong></p>
                  <p>Please check your inbox and enter the code below.</p>
                `,
                icon: 'info',
                confirmButtonColor: '#C8A951'
              });
            } else {
              throw new Error('Email OTP service failed');
            }
          } catch (emailError) {
            console.error('Email OTP fallback failed:', emailError);
            throw firebaseError; // Throw original Firebase error
          }
        } else {
          throw firebaseError; // Re-throw other Firebase errors
        }
      }
      
      setIsOtpSent(true);
      
      if (otpSentViaPhone) {
        Swal.fire({
          title: 'OTP Sent!',
          text: `Verification code has been sent to ${formattedPhone}`,
          icon: 'success',
          confirmButtonColor: '#C8A951'
        });
      }
      
    } catch (error) {
      console.error('Error sending OTP:', error);
      let errorMessage = 'Failed to send OTP. Please try again.';
      
      if (error.code === 'auth/invalid-phone-number') {
        errorMessage = 'Invalid phone number format.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many requests. Please try again later.';
      } else if (error.code === 'auth/argument-error') {
        errorMessage = 'Phone verification setup error. Please refresh the page.';
      } else if (error.code === 'auth/billing-not-enabled') {
        errorMessage = 'Phone verification is temporarily unavailable. Please contact support.';
      }
      
      Swal.fire({
        title: 'OTP Send Failed',
        text: errorMessage,
        icon: 'error',
        confirmButtonColor: '#C8A951'
      });
      
      // Reset verification state
      setIsOtpSent(false);
      setConfirmationResult(null);
    } finally {
      setIsOtpLoading(false);
    }
  };

  // Verify OTP (supports both Firebase and email OTP)
  const verifyOTP = async () => {
    if (!otp || otp.trim() === '') {
      Swal.fire({
        title: 'OTP Required',
        text: 'Please enter the verification code.',
        icon: 'warning',
        confirmButtonColor: '#C8A951'
      });
      return;
    }

    if (!confirmationResult) {
      Swal.fire({
        title: 'Error',
        text: 'Please request a new OTP.',
        icon: 'error',
        confirmButtonColor: '#C8A951'
      });
      return;
    }

    setIsOtpVerifying(true);

    try {
      // Test mode verification
      if (TEST_MODE && confirmationResult.testMode) {
        console.log('TEST MODE: Simulating OTP verification');
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate verification delay
        
        if (otp === '123456') {
          setIsPhoneVerified(true);
          
          // Sync phone verification with user profile if user is logged in
          if (currentUser) {
            try {
              const response = await axios.post(
                `${backendUrl}/api/user/verify-phone/${currentUser._id}`,
                {
                  phone: phone,
                  phoneVerified: true
                },
                { withCredentials: true }
              );
              
              // Update Redux store with the new user data
              dispatch(updateUserSuccess(response.data));
              
              console.log('Phone verification synced with profile (test mode):', response.data);
            } catch (error) {
              console.error('Error syncing phone verification with profile (test mode):', error);
            }
          }
          
          Swal.fire({
            title: 'Phone Verified! (Test Mode)',
            text: 'Your phone number has been successfully verified.',
            icon: 'success',
            confirmButtonColor: '#C8A951'
          });
        } else {
          throw new Error('Invalid test OTP');
        }
        return;
      }

      // Check if using email-based OTP fallback
      if (confirmationResult.emailMode) {
        console.log('Verifying email-based OTP...');
        
        const backendUrl = 
          process.env.NODE_ENV === 'production' 
            ? 'https://cinematic-popcorn-theatre-experience-2.onrender.com' 
            : 'http://localhost:5000';
        
        const verifyResponse = await axios.post(`${backendUrl}/api/auth/verify-email-otp`, {
          otpId: confirmationResult.otpId,
          otp: otp.trim(),
          phone: confirmationResult.phone
        }, {
          withCredentials: true
        });
        
        if (verifyResponse.data.success) {
          setIsPhoneVerified(true);
          
          // Sync phone verification with user profile if user is logged in
          if (currentUser) {
            try {
              const response = await axios.post(
                `${backendUrl}/api/user/verify-phone/${currentUser._id}`,
                {
                  phone: phone,
                  phoneVerified: true
                },
                { withCredentials: true }
              );
              
              // Update Redux store with the new user data
              dispatch(updateUserSuccess(response.data));
              
              console.log('Phone verification synced with profile (email mode):', response.data);
            } catch (error) {
              console.error('Error syncing phone verification with profile (email mode):', error);
            }
          }
          
          Swal.fire({
            title: 'Phone Verified!',
            text: 'Your phone number has been successfully verified via email.',
            icon: 'success',
            confirmButtonColor: '#C8A951'
          });
        } else {
          throw new Error('Invalid email OTP');
        }
        return;
      }

      // Production mode verification with Firebase
      await confirmationResult.confirm(otp);
      setIsPhoneVerified(true);
      
      // Sync phone verification with user profile if user is logged in
      if (currentUser) {
        try {
          const response = await axios.post(
            `${backendUrl}/api/user/verify-phone/${currentUser._id}`,
            {
              phone: phone,
              phoneVerified: true
            },
            { withCredentials: true }
          );
          
          // Update Redux store with the new user data
          dispatch(updateUserSuccess(response.data));
          
          console.log('Phone verification synced with profile:', response.data);
        } catch (error) {
          console.error('Error syncing phone verification with profile:', error);
          // Continue anyway, as the local verification was successful
        }
      }
      
      Swal.fire({
        title: 'Phone Verified!',
        text: 'Your phone number has been successfully verified.',
        icon: 'success',
        confirmButtonColor: '#C8A951'
      });
    } catch (error) {
      console.error('Error verifying OTP:', error);
      let errorMessage = 'Invalid verification code. Please try again.';
      
      if (error.code === 'auth/invalid-verification-code') {
        errorMessage = 'Invalid verification code.';
      } else if (error.code === 'auth/code-expired') {
        errorMessage = 'Verification code has expired. Please request a new one.';
      } else if (error.message === 'Invalid test OTP') {
        errorMessage = 'Invalid test OTP. Use 123456 for testing.';
      }
      
      Swal.fire({
        title: 'Verification Failed',
        text: errorMessage,
        icon: 'error',
        confirmButtonColor: '#C8A951'
      });
    } finally {
      setIsOtpVerifying(false);
    }
  };

  // Resend OTP
  const resendOTP = async () => {
    setOtp('');
    setIsOtpSent(false);
    setConfirmationResult(null);
    await sendOTP();
  };

  // Handle seat selection
  const handleSeatSelection = (seat) => {
    // Can't select unavailable seats
    if (seat.status !== 'AVAILABLE') return;
    
    setSelectedSeats(prev => {
      const isSelected = prev.some(s => s._id === seat._id);
      
      if (isSelected) {
        // Release the seat
        releaseSeat(showtimeId, seat._id);
        return prev.filter(s => s._id !== seat._id);
      } else {
        // Hold the seat
        holdSeat(showtimeId, seat._id);
        return [...prev, seat];
      }
    });
  };

  // Handle parking slot selection
  const handleParkingSelection = (slot, type) => {
    // Can't select unavailable parking slots
    if (slot.status !== 'AVAILABLE') return;
    
    if (type === 'twoWheeler') {
      setSelectedTwoWheelerSlots(prev => {
        const isSelected = prev.some(s => s._id === slot._id);
        
        if (isSelected) {
          // Release the slot
          releaseParkingSlot(showtimeId, slot._id);
          return prev.filter(s => s._id !== slot._id);
        } else {
          // Hold the slot
          holdParkingSlot(showtimeId, slot._id);
          return [...prev, slot];
        }
      });
    } else if (type === 'fourWheeler') {
      setSelectedFourWheelerSlots(prev => {
        const isSelected = prev.some(s => s._id === slot._id);
        
        if (isSelected) {
          // Release the slot
          releaseParkingSlot(showtimeId, slot._id);
          return prev.filter(s => s._id !== slot._id);
        } else {
          // Hold the slot
          holdParkingSlot(showtimeId, slot._id);
          return [...prev, slot];
        }
      });
    }
  };

  // Handle vehicle number input
  const handleVehicleNumberChange = (type, index, value) => {
    setVehicleNumbers(prev => {
      const newNumbers = [...prev[type]];
      newNumbers[index] = value;
      return { ...prev, [type]: newNumbers };
    });
  };

  // Proceed to payment
  const handleProceedToPayment = () => {
    if (selectedSeats.length === 0) {
      Swal.fire({
        title: 'No Seats Selected',
        text: 'Please select at least one seat to continue.',
        icon: 'warning',
        confirmButtonColor: '#C8A951'
      });
      return;
    }

    // Check if any seats or parking is selected - require phone verification for both
    const hasSeatsSelected = selectedSeats.length > 0;
    const hasParkingSelected = selectedTwoWheelerSlots.length > 0 || selectedFourWheelerSlots.length > 0;
    
    if (hasSeatsSelected || hasParkingSelected) {
      // Phone number is required for any booking
      if (!phone || phone.trim() === '') {
        Swal.fire({
          title: 'Phone Number Required',
          text: 'Phone number is required for booking verification. Please enter your phone number.',
          icon: 'warning',
          confirmButtonColor: '#C8A951'
        });
        return;
      }

      // Phone verification is required for any booking
      if (!isPhoneVerified) {
        Swal.fire({
          title: 'Phone Verification Required',
          text: 'Please verify your phone number with OTP before proceeding to payment.',
          icon: 'warning',
          confirmButtonColor: '#C8A951'
        });
        return;
      }
    }

    // Validate vehicle numbers for selected parking slots
    if (selectedTwoWheelerSlots.length > 0) {
      for (let i = 0; i < selectedTwoWheelerSlots.length; i++) {
        const vehicleNumber = vehicleNumbers.twoWheeler[i];
        if (!vehicleNumber || vehicleNumber.trim() === '') {
          Swal.fire({
            title: 'Vehicle Number Required',
            text: `Please enter vehicle number for Two Wheeler Slot ${selectedTwoWheelerSlots[i].slotNumber}.`,
            icon: 'warning',
            confirmButtonColor: '#C8A951'
          });
          return;
        }
        // Basic vehicle number validation (can be customized for Indian format)
        const vehicleRegex = /^[A-Z]{2}[0-9]{1,2}[A-Z]{1,2}[0-9]{4}$/i;
        if (!vehicleRegex.test(vehicleNumber.replace(/\s/g, ''))) {
          Swal.fire({
            title: 'Invalid Vehicle Number',
            text: `Please enter a valid vehicle number for Two Wheeler Slot ${selectedTwoWheelerSlots[i].slotNumber} (e.g., TN01AB1234).`,
            icon: 'error',
            confirmButtonColor: '#C8A951'
          });
          return;
        }
      }
    }

    if (selectedFourWheelerSlots.length > 0) {
      for (let i = 0; i < selectedFourWheelerSlots.length; i++) {
        const vehicleNumber = vehicleNumbers.fourWheeler[i];
        if (!vehicleNumber || vehicleNumber.trim() === '') {
          Swal.fire({
            title: 'Vehicle Number Required',
            text: `Please enter vehicle number for Four Wheeler Slot ${selectedFourWheelerSlots[i].slotNumber}.`,
            icon: 'warning',
            confirmButtonColor: '#C8A951'
          });
          return;
        }
        // Basic vehicle number validation (can be customized for Indian format)
        const vehicleRegex = /^[A-Z]{2}[0-9]{1,2}[A-Z]{1,2}[0-9]{4}$/i;
        if (!vehicleRegex.test(vehicleNumber.replace(/\s/g, ''))) {
          Swal.fire({
            title: 'Invalid Vehicle Number',
            text: `Please enter a valid vehicle number for Four Wheeler Slot ${selectedFourWheelerSlots[i].slotNumber} (e.g., TN01AB1234).`,
            icon: 'error',
            confirmButtonColor: '#C8A951'
          });
          return;
        }
      }
    }
    
    // Create booking data
    const bookingData = {
      showtimeId,
      movieId,
      seats: selectedSeats.map(seat => seat._id),
      parkingSlots: [
        ...selectedTwoWheelerSlots.map(slot => ({ 
          slotId: slot._id,
          vehicleNumber: vehicleNumbers.twoWheeler[selectedTwoWheelerSlots.indexOf(slot)] || ''
        })),
        ...selectedFourWheelerSlots.map(slot => ({
          slotId: slot._id,
          vehicleNumber: vehicleNumbers.fourWheeler[selectedFourWheelerSlots.indexOf(slot)] || ''
        }))
      ],
      phone,
      totalCost
    };
    
    // Navigate to payment page with booking data
    navigate('/payment-new', { 
      state: { 
        bookingData,
        movieDetails: movieData,
        showtimeDetails: showtimeData,
        selectedSeats,
        selectedParking: {
          twoWheeler: selectedTwoWheelerSlots,
          fourWheeler: selectedFourWheelerSlots
        }
      } 
    });
  };

  // Toggle parking needed
  const handleToggleParkingNeeded = () => {
    setParkingNeeded(!parkingNeeded);
    
    // Clear parking selections if turning off parking
    if (parkingNeeded) {
      // Release all selected parking slots
      selectedTwoWheelerSlots.forEach(slot => {
        releaseParkingSlot(showtimeId, slot._id);
      });
      
      selectedFourWheelerSlots.forEach(slot => {
        releaseParkingSlot(showtimeId, slot._id);
      });
      
      setSelectedTwoWheelerSlots([]);
      setSelectedFourWheelerSlots([]);
      setVehicleNumbers({ twoWheeler: [], fourWheeler: [] });
    }
  };

  // Group seats by row for display
  const seatsByRow = Array.isArray(seats) && seats.length > 0 ? seats.reduce((acc, seat) => {
    const row = seat?.row || '';
    if (!acc[row]) acc[row] = [];
    acc[row].push(seat);
    return acc;
  }, {}) : {};

  // Debug seat grouping
  console.log('Total seats:', seats.length);
  console.log('Seats by row:', seatsByRow);
  console.log('Row keys:', Object.keys(seatsByRow));
  Object.keys(seatsByRow).forEach(row => {
    console.log(`Row ${row}: ${seatsByRow[row].length} seats`);
  });

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D]">
        <div className="text-center">
          <FontAwesomeIcon icon={faSpinner} spin size="3x" className="text-[#C8A951] mb-4" />
          <p className="text-[#F5F5F5] text-xl">Loading ticket information...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D]">
        <div className="text-center p-8 max-w-md bg-[#1A1A1A] rounded-lg shadow-lg border border-[#C8A951]/20">
          <FontAwesomeIcon icon={faExclamationCircle} size="3x" className="text-red-400 mb-4" />
          <h2 className="text-2xl font-bold text-[#F5F5F5] mb-2">Error Loading Tickets</h2>
          <p className="text-[#F5F5F5]/80 mb-4">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-[#C8A951] hover:bg-[#DFBD69] text-[#0D0D0D] font-semibold rounded-md transition-all duration-300"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] py-10">
      <div className="container mx-auto px-4">
        {/* Movie and showtime info */}
        {movieData && showtimeData && (
          <div className="bg-[#1A1A1A] p-6 rounded-lg shadow-lg mb-8 border border-[#C8A951]/20">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="w-full md:w-1/4">
                <img 
                  src={getMovieImage(movieData)} 
                  alt={movieData.name}
                  className="w-full h-auto rounded-lg shadow-md"
                  onError={(e) => {
                    e.target.src = '/src/images/new.jpg';
                  }}
                />
              </div>
              
              <div className="w-full md:w-3/4">
                <h1 className="text-3xl font-bold text-[#F5F5F5] mb-2">{movieData.name}</h1>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-[#C8A951] text-[#0D0D0D] font-semibold text-sm rounded-full">
                    {movieData.genre}
                  </span>
                  <span className="px-3 py-1 bg-[#1A1A1A] border border-[#C8A951]/30 text-[#F5F5F5] text-sm rounded-full">
                    {movieData.duration} min
                  </span>
                  <span className="px-3 py-1 bg-[#1A1A1A] border border-[#C8A951]/30 text-[#F5F5F5] text-sm rounded-full">
                    {movieData.rating}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div>
                    <div className="flex items-center text-[#F5F5F5] mb-2">
                      <FontAwesomeIcon icon={faFilm} className="w-5 h-5 mr-2 text-[#C8A951]" />
                      <span className="font-medium">Screen:</span>
                      <span className="ml-2">{showtimeData.screen || 'Loading...'}</span>
                    </div>
                    
                    <div className="flex items-center text-[#F5F5F5] mb-2">
                      <FontAwesomeIcon icon={faClock} className="w-5 h-5 mr-2 text-[#C8A951]" />
                      <span className="font-medium">Date:</span>
                      <span className="ml-2">
                        {showtimeData.startTime ? new Date(showtimeData.startTime).toLocaleDateString() : 'Loading...'}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-[#F5F5F5]">
                      <FontAwesomeIcon icon={faClock} className="w-5 h-5 mr-2 text-[#C8A951]" />
                      <span className="font-medium">Time:</span>
                      <span className="ml-2">
                        {showtimeData.startTime ? new Date(showtimeData.startTime).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        }) : 'Loading...'}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center text-[#F5F5F5] mb-2">
                      <FontAwesomeIcon icon={faUsers} className="w-5 h-5 mr-2 text-[#C8A951]" />
                      <span className="font-medium">Available Seats:</span>
                      <span className="ml-2">
                        {Array.isArray(seats) ? 
                          `${seats.filter(seat => seat.status === 'AVAILABLE').length} / ${seats.length}` :
                          'Loading...'}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-[#F5F5F5]">
                      <FontAwesomeIcon icon={faDollarSign} className="w-5 h-5 mr-2 text-[#C8A951]" />
                      <span className="font-medium">Current Selection:</span>
                      <span className="ml-2">₹{totalCost}</span>
                    </div>
                  </div>
                </div>
                
                {/* Status indicators */}
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-[#3A3A3A] rounded-sm mr-2"></div>
                    <span className="text-[#F5F5F5] text-sm">Available</span>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-[#C8A951] rounded-sm mr-2"></div>
                    <span className="text-[#F5F5F5] text-sm">Selected</span>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-yellow-500 rounded-sm mr-2"></div>
                    <span className="text-[#F5F5F5] text-sm">Held</span>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-500 rounded-sm mr-2"></div>
                    <span className="text-[#F5F5F5] text-sm">Sold</span>
                  </div>
                </div>
                
                {/* Socket connection status */}
                <div className="flex items-center mt-4">
                  <div className={`w-3 h-3 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-sm text-[#F5F5F5]">
                    {isConnected ? 'Real-time updates active' : 'Connecting to real-time server...'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Seat selection */}
        <div className="bg-[#1A1A1A] p-6 rounded-lg shadow-lg mb-8 border border-[#C8A951]/20">
          <h2 className="text-2xl font-semibold text-[#F5F5F5] mb-6">
            Select Your Seats
          </h2>
          
          <div className="w-full flex justify-center mb-8">
            <div className="w-full max-w-3xl">
              <div className="bg-[#C8A951] text-center text-[#0D0D0D] font-semibold p-2 mb-8 rounded">
                SCREEN
              </div>
              
              {/* Seats arrangement */}
              <div className="space-y-4">
                {Object.keys(seatsByRow).sort().map(row => (
                  <div key={row} className="flex justify-center">
                    <div className="w-8 flex items-center justify-center text-gray-300 font-semibold">
                      {row}
                    </div>
                    
                    <div className="flex gap-2 flex-wrap justify-center">
                      {seatsByRow[row].sort((a, b) => a.number - b.number).map(seat => {
                        // Determine seat status class
                        let seatClass = 'bg-[#3A3A3A] hover:bg-[#4A4A4A]'; // available
                        
                        if (Array.isArray(selectedSeats) && selectedSeats.some(s => s._id === seat._id)) {
                          seatClass = 'bg-[#C8A951] hover:bg-[#DFBD69]'; // selected by current user
                        } else if (seat.status === 'HELD') {
                          seatClass = 'bg-yellow-500 cursor-not-allowed'; // held by someone
                        } else if (seat.status === 'SOLD') {
                          seatClass = 'bg-red-500 cursor-not-allowed'; // sold
                        }
                        
                        return (
                          <div 
                            key={seat._id}
                            onClick={() => handleSeatSelection(seat)}
                            className={`${seatClass} w-10 h-10 flex items-center justify-center 
                                      text-[#F5F5F5] text-sm rounded-sm cursor-pointer transition-all
                                      ${seat.category === 'PREMIUM' ? 'border-2 border-[#C8A951]' : ''}
                                      ${seat.category === 'VIP' ? 'border-2 border-[#DFBD69]' : ''}`}
                          >
                            {seat.number}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Seat categories */}
              <div className="flex justify-center mt-6 space-x-4">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-[#3A3A3A] mr-2"></div>
                  <span className="text-[#F5F5F5] text-sm">Standard (₹{SEAT_PRICE.STANDARD})</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-[#3A3A3A] border-2 border-[#C8A951] mr-2"></div>
                  <span className="text-[#F5F5F5] text-sm">Premium (₹{SEAT_PRICE.PREMIUM})</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-[#3A3A3A] border-2 border-[#DFBD69] mr-2"></div>
                  <span className="text-[#F5F5F5] text-sm">VIP (₹{SEAT_PRICE.VIP})</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Parking section */}
        <div className="bg-[#1A1A1A] p-6 rounded-lg shadow-lg mb-8 border border-[#C8A951]/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-[#F5F5F5]">
              Valet Parking
            </h2>
            
            <button
              onClick={handleToggleParkingNeeded}
              className={`px-4 py-2 rounded-md flex items-center transition
                ${parkingNeeded
                  ? 'bg-[#C8A951] hover:bg-[#DFBD69] text-[#0D0D0D] font-semibold'
                  : 'bg-[#3A3A3A] hover:bg-[#4A4A4A] text-[#F5F5F5]'}`}
            >
              <FontAwesomeIcon 
                icon={parkingNeeded ? faLock : faLockOpen} 
                className="mr-2" 
              />
              {parkingNeeded ? 'Parking Selected' : 'Add Parking'}
            </button>
          </div>
          
          {parkingNeeded && (
            <div className="space-y-6">
              {/* Two Wheeler Parking */}
              <div>
                <h3 className="text-xl font-medium text-[#F5F5F5] mb-4 flex items-center">
                  <FontAwesomeIcon icon={faMotorcycle} className="mr-2 text-[#C8A951]" />
                  Two Wheeler Parking (₹{TWO_WHEELER_PRICE}/slot)
                </h3>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                  {parkingSlots.twoWheeler.map(slot => {
                    // Determine slot status class
                    let slotClass = 'bg-[#3A3A3A] hover:bg-[#4A4A4A]'; // available
                    
                    if (selectedTwoWheelerSlots.some(s => s._id === slot._id)) {
                      slotClass = 'bg-[#C8A951] hover:bg-[#DFBD69]'; // selected by current user
                    } else if (slot.status === 'HELD') {
                      slotClass = 'bg-yellow-500 cursor-not-allowed'; // held by someone
                    } else if (slot.status === 'SOLD') {
                      slotClass = 'bg-red-500 cursor-not-allowed'; // sold
                    }
                    
                    return (
                      <div 
                        key={slot._id}
                        onClick={() => handleParkingSelection(slot, 'twoWheeler')}
                        className={`${slotClass} p-3 flex items-center justify-center 
                                  text-[#F5F5F5] rounded-md cursor-pointer transition-all`}
                      >
                        <div className="text-center">
                          <FontAwesomeIcon icon={faMotorcycle} className="mb-1" />
                          <div className="text-sm">{slot.slotNumber}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Vehicle number inputs */}
                {selectedTwoWheelerSlots.length > 0 && (
                  <div className="mt-4">
                    <p className="text-[#C8A951] text-sm mb-3 flex items-center">
                      <FontAwesomeIcon icon={faExclamationCircle} className="mr-2" />
                      Vehicle numbers are required for all selected parking slots (e.g., TN01AB1234)
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {selectedTwoWheelerSlots.map((slot, index) => (
                      <div key={slot._id} className="flex items-center">
                        <span className="text-[#F5F5F5] mr-2 whitespace-nowrap">
                          {slot.slotNumber}:
                        </span>
                        <input
                          type="text"
                          placeholder="Vehicle Number *"
                          value={vehicleNumbers.twoWheeler[index] || ''}
                          onChange={(e) => handleVehicleNumberChange('twoWheeler', index, e.target.value)}
                          className="bg-[#1A1A1A] border-2 border-[#C8A951] text-[#F5F5F5] px-3 py-1 rounded-md w-full focus:border-[#DFBD69] focus:ring-2 focus:ring-[#C8A951]/20 focus:outline-none transition-all duration-300"
                          required
                        />
                      </div>
                    ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Four Wheeler Parking */}
              <div>
                <h3 className="text-xl font-medium text-[#F5F5F5] mb-4 flex items-center">
                  <FontAwesomeIcon icon={faCar} className="mr-2 text-[#C8A951]" />
                  Four Wheeler Parking (₹{FOUR_WHEELER_PRICE}/slot)
                </h3>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {parkingSlots.fourWheeler.map(slot => {
                    // Determine slot status class
                    let slotClass = 'bg-[#3A3A3A] hover:bg-[#4A4A4A]'; // available
                    
                    if (selectedFourWheelerSlots.some(s => s._id === slot._id)) {
                      slotClass = 'bg-[#C8A951] hover:bg-[#DFBD69]'; // selected by current user
                    } else if (slot.status === 'HELD') {
                      slotClass = 'bg-yellow-500 cursor-not-allowed'; // held by someone
                    } else if (slot.status === 'SOLD') {
                      slotClass = 'bg-red-500 cursor-not-allowed'; // sold
                    }
                    
                    return (
                      <div 
                        key={slot._id}
                        onClick={() => handleParkingSelection(slot, 'fourWheeler')}
                        className={`${slotClass} p-4 flex items-center justify-center 
                                  text-[#F5F5F5] rounded-md cursor-pointer transition-all`}
                      >
                        <div className="text-center">
                          <FontAwesomeIcon icon={faCar} className="mb-1" />
                          <div className="text-sm">{slot.slotNumber}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Vehicle number inputs */}
                {selectedFourWheelerSlots.length > 0 && (
                  <div className="mt-4">
                    <p className="text-[#C8A951] text-sm mb-3 flex items-center">
                      <FontAwesomeIcon icon={faExclamationCircle} className="mr-2" />
                      Vehicle numbers are required for all selected parking slots (e.g., TN01AB1234)
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {selectedFourWheelerSlots.map((slot, index) => (
                      <div key={slot._id} className="flex items-center">
                        <span className="text-[#F5F5F5] mr-2 whitespace-nowrap">
                          {slot.slotNumber}:
                        </span>
                        <input
                          type="text"
                          placeholder="Vehicle Number *"
                          value={vehicleNumbers.fourWheeler[index] || ''}
                          onChange={(e) => handleVehicleNumberChange('fourWheeler', index, e.target.value)}
                          className="bg-[#1A1A1A] border-2 border-[#C8A951] text-[#F5F5F5] px-3 py-1 rounded-md w-full focus:border-[#DFBD69] focus:ring-2 focus:ring-[#C8A951]/20 focus:outline-none transition-all duration-300"
                          required
                        />
                      </div>
                    ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Contact information */}
        <div className="bg-[#1A1A1A] p-6 rounded-lg shadow-lg mb-8 border border-[#C8A951]/20">
          <h2 className="text-2xl font-semibold text-[#F5F5F5] mb-4">
            Contact Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className={`block mb-1 ${
                  (selectedSeats.length > 0 || selectedTwoWheelerSlots.length > 0 || selectedFourWheelerSlots.length > 0) 
                    ? 'text-[#C8A951] font-semibold' 
                    : 'text-[#F5F5F5]'
                }`}>
                  Phone Number {(selectedSeats.length > 0 || selectedTwoWheelerSlots.length > 0 || selectedFourWheelerSlots.length > 0) && (
                    <span className="text-red-400">*</span>
                  )}
                  {(selectedSeats.length > 0 || selectedTwoWheelerSlots.length > 0 || selectedFourWheelerSlots.length > 0) && (
                    <span className="text-sm text-yellow-400 block">Required for booking verification</span>
                  )}
                </label>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    placeholder="Enter your phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`flex-1 px-4 py-2 rounded-md transition-all duration-300 ${
                      (selectedSeats.length > 0 || selectedTwoWheelerSlots.length > 0 || selectedFourWheelerSlots.length > 0)
                        ? 'bg-[#1A1A1A] border-2 border-[#C8A951] text-[#F5F5F5] focus:border-[#DFBD69] focus:ring-2 focus:ring-[#C8A951]/20'
                        : 'bg-[#1A1A1A] border border-gray-600 text-[#F5F5F5] focus:border-[#C8A951] focus:ring-1 focus:ring-[#C8A951]/20'
                    } focus:outline-none`}
                    required={selectedSeats.length > 0 || selectedTwoWheelerSlots.length > 0 || selectedFourWheelerSlots.length > 0}
                    disabled={isPhoneVerified}
                  />
                  {!isPhoneVerified && (selectedSeats.length > 0 || selectedTwoWheelerSlots.length > 0 || selectedFourWheelerSlots.length > 0) && (
                    <button
                      onClick={sendOTP}
                      disabled={isOtpLoading || !phone || phone.trim() === ''}
                      className="px-4 py-2 bg-[#C8A951] hover:bg-[#DFBD69] text-[#0D0D0D] font-semibold rounded-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      {isOtpLoading ? (
                        <>
                          <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faKey} className="mr-2" />
                          {isOtpSent ? 'Resend OTP' : 'Send OTP'}
                        </>
                      )}
                    </button>
                  )}
                </div>
                
                {/* Phone verification status */}
                {isPhoneVerified && (
                  <div className="flex items-center mt-2 text-green-400">
                    <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                    <span className="text-sm">Phone number verified</span>
                  </div>
                )}
              </div>
              
              {/* OTP Input */}
              {isOtpSent && !isPhoneVerified && (
                <div>
                  <label className="block mb-1 text-[#C8A951] font-semibold">
                    Verification Code <span className="text-red-400">*</span>
                    <span className="text-sm text-yellow-400 block">Enter the 6-digit code sent to your phone</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter 6-digit code"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="flex-1 px-4 py-2 rounded-md bg-[#1A1A1A] border-2 border-[#C8A951] text-[#F5F5F5] focus:border-[#DFBD69] focus:ring-2 focus:ring-[#C8A951]/20 focus:outline-none"
                      maxLength="6"
                    />
                    <button
                      onClick={verifyOTP}
                      disabled={isOtpVerifying || !otp || otp.trim() === ''}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      {isOtpVerifying ? (
                        <>
                          <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faShield} className="mr-2" />
                          Verify
                        </>
                      )}
                    </button>
                  </div>
                  
                  <div className="mt-2 text-center">
                    <button
                      onClick={resendOTP}
                      className="text-[#C8A951] hover:text-[#DFBD69] text-sm underline"
                    >
                      Didn't receive the code? Resend OTP
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Verification Status Card */}
            {(selectedSeats.length > 0 || selectedTwoWheelerSlots.length > 0 || selectedFourWheelerSlots.length > 0) && (
              <div className="bg-[#0D0D0D] p-4 rounded-lg border border-[#C8A951]/30">
                <h3 className="text-lg font-semibold text-[#F5F5F5] mb-3 flex items-center">
                  <FontAwesomeIcon icon={faShield} className="mr-2 text-[#C8A951]" />
                  Verification Status
                </h3>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[#F5F5F5] text-sm">Phone Number:</span>
                    <span className={`text-sm ${phone ? 'text-green-400' : 'text-yellow-400'}`}>
                      {phone ? 'Entered' : 'Required'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-[#F5F5F5] text-sm">OTP Sent:</span>
                    <span className={`text-sm ${isOtpSent ? 'text-green-400' : 'text-gray-400'}`}>
                      {isOtpSent ? 'Yes' : 'Pending'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-[#F5F5F5] text-sm">Phone Verified:</span>
                    <span className={`text-sm ${isPhoneVerified ? 'text-green-400' : 'text-yellow-400'}`}>
                      {isPhoneVerified ? 'Verified' : 'Required'}
                    </span>
                  </div>
                </div>
                
                {!isPhoneVerified && (selectedSeats.length > 0 || selectedTwoWheelerSlots.length > 0 || selectedFourWheelerSlots.length > 0) && (
                  <div className="mt-3 p-2 bg-yellow-500/10 border border-yellow-500/30 rounded">
                    <p className="text-yellow-400 text-xs">
                      <FontAwesomeIcon icon={faExclamationCircle} className="mr-1" />
                      Phone verification is required to proceed with payment
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Hidden reCAPTCHA container */}
          <div id="recaptcha-container"></div>
        </div>
        
        {/* Summary and checkout */}
        <div className="bg-[#1A1A1A] p-6 rounded-lg shadow-lg border border-[#C8A951]/20">
          <h2 className="text-2xl font-semibold text-[#F5F5F5] mb-4">
            Booking Summary
          </h2>
          
          <div className="space-y-2 mb-6">
            <div className="flex justify-between">
              <span className="text-[#F5F5F5]/80">Selected Seats:</span>
              <span className="text-[#F5F5F5] font-medium">
                {!Array.isArray(selectedSeats) || selectedSeats.length === 0 ? 'None' : 
                 selectedSeats.map(seat => `${seat.row}${seat.number}`).join(', ')}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-[#F5F5F5]/80">Seats Cost:</span>
              <span className="text-[#F5F5F5] font-medium">
                ₹{Array.isArray(selectedSeats) ? selectedSeats.reduce((acc, seat) => {
                  return acc + (SEAT_PRICE[seat.category] || SEAT_PRICE.STANDARD);
                }, 0) : 0}
              </span>
            </div>
            
            {parkingNeeded && (
              <>
                <div className="flex justify-between">
                  <span className="text-[#F5F5F5]/80">Two Wheeler Parking:</span>
                  <span className="text-[#F5F5F5] font-medium">
                    {selectedTwoWheelerSlots.length} × ₹{TWO_WHEELER_PRICE} = ₹{selectedTwoWheelerSlots.length * TWO_WHEELER_PRICE}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-[#F5F5F5]/80">Four Wheeler Parking:</span>
                  <span className="text-[#F5F5F5] font-medium">
                    {selectedFourWheelerSlots.length} × ₹{FOUR_WHEELER_PRICE} = ₹{selectedFourWheelerSlots.length * FOUR_WHEELER_PRICE}
                  </span>
                </div>
              </>
            )}
            
            <div className="border-t border-[#C8A951]/30 pt-2 mt-2">
              <div className="flex justify-between text-lg">
                <span className="text-[#C8A951] font-semibold">Total Cost:</span>
                <span className="text-[#C8A951] font-bold text-xl">₹{totalCost}</span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={handleProceedToPayment}
              disabled={
                !Array.isArray(selectedSeats) || 
                selectedSeats.length === 0 || 
                ((selectedSeats.length > 0 || selectedTwoWheelerSlots.length > 0 || selectedFourWheelerSlots.length > 0) && !isPhoneVerified)
              }
              className="px-6 py-3 bg-[#C8A951] hover:bg-[#DFBD69] text-[#0D0D0D] font-semibold rounded-md transition-all duration-300
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[#3A3A3A] disabled:text-[#F5F5F5]/50"
            >
              <FontAwesomeIcon icon={faDollarSign} className="mr-2" />
              {((selectedSeats.length > 0 || selectedTwoWheelerSlots.length > 0 || selectedFourWheelerSlots.length > 0) && !isPhoneVerified) 
                ? 'Verify Phone to Continue' 
                : 'Proceed to Payment'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tickets;
