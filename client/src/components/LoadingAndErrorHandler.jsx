import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

export const LoadingState = ({ message = "Loading data..." }) => (
  <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D]">
    <div className="text-center">
      <FontAwesomeIcon icon={faSpinner} spin size="3x" className="text-[#C8A951] mb-4" />
      <p className="text-[#F5F5F5] text-xl font-poppins">{message}</p>
    </div>
  </div>
);

export const ErrorState = ({ 
  error, 
  onRetry, 
  showRetry = true,
  showRealTimeOption = true
}) => {
  // Check if the error is related to booking/showtimes
  const isBookingError = error && (
    error.includes("showtime") || 
    error.includes("Showtime") || 
    error.includes("booking") || 
    error.includes("Movie") || 
    error.includes("movie") ||
    error.includes("not found")
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D]">
      <div className="text-center p-8 max-w-md bg-[#121212] rounded-lg border border-[#E50914]/30" 
        style={{boxShadow: '0 0 20px rgba(0, 0, 0, 0.5), 0 0 10px rgba(229, 9, 20, 0.1)'}}>
        <FontAwesomeIcon icon={faExclamationCircle} size="3x" className="text-[#E50914] mb-4" />
        <h2 className="text-2xl font-bold text-[#F5F5F5] mb-2 font-cinzel">
          {isBookingError ? "Booking Error" : "Error Loading Data"}
        </h2>
        <p className="text-[#F5F5F5] mb-6 font-poppins">{error}</p>
        
        {isBookingError && (
          <div className="bg-blue-900/30 p-4 mb-6 border border-blue-500/30 rounded-md">
            <p className="text-blue-200 text-sm font-poppins">
              For a better experience, try our new real-time booking system from the home page. 
              It offers live seat selection and better reliability.
            </p>
          </div>
        )}
        
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          {showRetry && onRetry && (
            <button
              onClick={onRetry}
              className="px-6 py-2 bg-[#0D0D0D] border border-[#C8A951] text-[#F5F5F5] hover:bg-[#C8A951]/10 transition-all font-cinzel"
            >
              Try Again
            </button>
          )}
          
          {isBookingError && showRealTimeOption && (
            <button
              onClick={() => window.location.href = '/'}
              className="px-6 py-2 bg-[#0D0D0D] border border-blue-500 text-[#F5F5F5] hover:bg-blue-500/10 transition-all font-cinzel flex items-center"
            >
              <span className="mr-2">Real-Time Booking</span>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            </button>
          )}
          
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-2 bg-[#0D0D0D] border border-[#E50914] text-[#F5F5F5] hover:bg-[#E50914]/10 transition-all font-cinzel"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    </div>
  );
};
