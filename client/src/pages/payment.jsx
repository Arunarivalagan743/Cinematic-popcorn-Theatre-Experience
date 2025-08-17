
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { FaCreditCard, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const Payment = () => {
  const [bookingData, setBookingData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [movieCost, setMovieCost] = useState(0);
  const [parkingCost, setParkingCost] = useState(0);

  const [localParkingDetails, setLocalParkingDetails] = useState({
    selectedSlot: { twoWheeler: 'N/A', fourWheeler: 'N/A' },
    vehicleNumber: '', // Default empty vehicle number
  });

  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  // Define parking costs
  const twoWheelerCost = 20;
  const fourWheelerCost = 30;

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('bookingData'));

    if (data) {
      setBookingData(data);

      // Calculate movie cost and parking cost separately
      const calculatedMovieCost = data.totalCost || 0;
      setMovieCost(calculatedMovieCost);

      let calculatedParkingCost = 0;
      if (data.parkingDetails) {
        if (data.parkingDetails.parkingType === 'Two-Wheeler') {
          calculatedParkingCost = twoWheelerCost;
        } else if (data.parkingDetails.parkingType === 'Four-Wheeler') {
          calculatedParkingCost = fourWheelerCost;
        }
        setLocalParkingDetails({
          selectedSlot: data.parkingDetails.selectedSlot || { twoWheeler: 'N/A', fourWheeler: 'N/A' },
          vehicleNumber: data.parkingDetails.vehicleNumber || '',
        });
      }
      setParkingCost(calculatedParkingCost);
    }
  }, []);

  const handlePayment = async () => {
    if (!bookingData) {
      Swal.fire({
        icon: 'error',
        title: `<span class="text-3xl font-cinzel font-bold text-[#E50914]" style="text-shadow: 0 0 10px rgba(229, 9, 20, 0.3);">No booking data!</span>`,
        text: 'There was an issue fetching your booking data. Please try again.',
        confirmButtonText: '<span class="text-white">OK</span>',
        confirmButtonColor: '#0D0D0D',
        background: '#0D0D0D',
        customClass: {
          popup: 'shadow-2xl border border-[#E50914]/30',
          title: 'text-center mb-4',
          content: 'text-[#F5F5F5] font-poppins',
          actions: 'flex justify-center space-x-4 mt-4',
          confirmButton: 'px-8 py-2 border border-[#E50914] hover:bg-[#E50914]/10 transition duration-200',
        },
        backdrop: true,
        didOpen: () => {
          document.querySelector('.swal2-backdrop').style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
        }
      });
      return;
    }

    if (!currentUser) {
      Swal.fire({
        icon: 'error',
        title: `<span class="text-3xl font-cinzel font-bold text-[#E50914]" style="text-shadow: 0 0 10px rgba(229, 9, 20, 0.3);">User not logged in!</span>`,
        text: 'Please log in to complete the payment.',
        confirmButtonText: '<span class="text-white">OK</span>',
        confirmButtonColor: '#0D0D0D',
        background: '#0D0D0D',
        customClass: {
          popup: 'shadow-2xl border border-[#E50914]/30',
          title: 'text-center mb-4',
          content: 'text-[#F5F5F5] font-poppins',
          actions: 'flex justify-center space-x-4 mt-4',
          confirmButton: 'px-8 py-2 border border-[#E50914] hover:bg-[#E50914]/10 transition duration-200',
        },
        backdrop: true,
        didOpen: () => {
          document.querySelector('.swal2-backdrop').style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
        }
      });
      return;
    }

    setIsLoading(true);
    try {
      const paymentData = {
        ...bookingData,
        userEmail: currentUser.email,
        parkingDetails: {
          ...bookingData.parkingDetails,
          vehicleNumber: localParkingDetails.vehicleNumber,
        },
      };

      const response = await axios.post('https://cinematic-popcorn-theatre-experience-2.onrender.com/api/confirm-payment', { bookingData: paymentData }
        , {
  withCredentials: true, // ✅ Add this
}
      );

      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: `<span class="text-3xl font-cinzel font-bold text-[#C8A951]" style="text-shadow: 0 0 10px rgba(200, 169, 81, 0.3);">Payment Confirmed!</span>`,
          text: 'Your payment has been successfully processed and a confirmation email has been sent.',
          confirmButtonText: '<span class="text-white">OK</span>',
          confirmButtonColor: '#0D0D0D',
          background: '#0D0D0D',
          showCancelButton: false,
          customClass: {
            popup: 'shadow-2xl border border-[#C8A951]/30',
            title: 'text-center mb-4',
            content: 'text-[#F5F5F5] font-poppins',
            actions: 'flex justify-center space-x-4 mt-4',
            confirmButton: 'px-8 py-2 border border-[#C8A951] hover:bg-[#C8A951]/10 transition duration-200',
          },
          backdrop: true,
          didOpen: () => {
            document.querySelector('.swal2-backdrop').style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
            document.querySelector('.swal2-success-circular-line-left').style.backgroundColor = 'transparent';
            document.querySelector('.swal2-success-circular-line-right').style.backgroundColor = 'transparent';
            document.querySelector('.swal2-success-fix').style.backgroundColor = 'transparent';
            document.querySelector('.swal2-success-ring').style.borderColor = '#C8A951';
            let successIcon = document.querySelector('.swal2-success-line-tip, .swal2-success-line-long');
            if (successIcon) {
              successIcon.style.backgroundColor = '#C8A951';
            }
          }
        });
        

        localStorage.removeItem('bookingData');
        navigate('/'); // Redirect to a confirmation page or homepage
      } else {
        Swal.fire({
          icon: 'error',
          title: `<span class="text-3xl font-cinzel font-bold text-[#E50914]" style="text-shadow: 0 0 10px rgba(229, 9, 20, 0.3);">Payment Failed!</span>`,
          text: 'There was an error processing your payment. Please try again.',
          confirmButtonText: '<span class="text-white">OK</span>',
          confirmButtonColor: '#0D0D0D',
          background: '#0D0D0D',
          customClass: {
            popup: 'shadow-2xl border border-[#E50914]/30',
            title: 'text-center mb-4',
            content: 'text-[#F5F5F5] font-poppins',
            actions: 'flex justify-center space-x-4 mt-4',
            confirmButton: 'px-8 py-2 border border-[#E50914] hover:bg-[#E50914]/10 transition duration-200',
          },
          backdrop: true,
          didOpen: () => {
            document.querySelector('.swal2-backdrop').style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
          }
        });
      }
    } catch (error) {
      console.error('Error during payment confirmation:', error);
      Swal.fire({
        icon: 'error',
        title: 'Payment Failed!',
        text: 'An error occurred while processing the payment.',
        confirmButtonText: 'OK',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const totalAmount = movieCost + parkingCost;

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex justify-center items-center p-6">
      <div className="bg-[#0D0D0D] border border-[#C8A951]/30 p-8 shadow-xl w-full max-w-lg transform transition-all duration-500 hover:scale-102" style={{boxShadow: '0 0 25px rgba(0, 0, 0, 0.7), 0 0 15px rgba(200, 169, 81, 0.2)'}}>
        <h1 className="text-4xl font-playfair font-semibold text-center text-[#C8A951] mb-8 animate-fadeIn" style={{textShadow: '0 0 10px rgba(200, 169, 81, 0.3)'}}>
          Confirm Payment
        </h1>
        {currentUser && (
          <div className="text-center text-lg mb-6 text-[#C8A951] font-cinzel">
            <p>Welcome, {currentUser.email}</p>
          </div>
        )}

        <div className="text-[#F5F5F5]">
          {bookingData ? (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-cinzel font-semibold text-[#C8A951] border-b border-[#C8A951]/30 pb-2 mb-4" style={{textShadow: '0 0 8px rgba(200, 169, 81, 0.2)'}}>Booking Details</h2>
                <div className="space-y-2 font-poppins">
                  <p><span className="text-[#C8A951] font-medium">Movie Title:</span> {bookingData.movie}</p>
                  <p><span className="text-[#C8A951] font-medium">Screen:</span> {bookingData.screen}</p>
                  <p><span className="text-[#C8A951] font-medium">Show Timing:</span> {bookingData.timing}</p>
                  <p><span className="text-[#C8A951] font-medium">Selected Seats:</span> {bookingData.seats.join(', ')}</p>
                </div>

                {bookingData.parkingDetails && (
                  <div className="mt-6">
                    <h3 className="text-xl font-cinzel font-semibold text-[#C8A951] border-b border-[#C8A951]/30 pb-2 mb-3" style={{textShadow: '0 0 8px rgba(200, 169, 81, 0.2)'}}>Parking Details</h3>
                    <div className="space-y-2 font-poppins">
                      <p><span className="text-[#C8A951] font-medium">Two-Wheeler Slot:</span> {localParkingDetails.selectedSlot?.twoWheeler || 'N/A'}</p>
                      <p><span className="text-[#C8A951] font-medium">Four-Wheeler Slot:</span> {localParkingDetails.selectedSlot?.fourWheeler || 'N/A'}</p>
                      <p><span className="text-[#C8A951] font-medium">Two-Wheeler Vehicle Numbers:</span> {bookingData.parkingDetails.vehicleNumbers?.twoWheeler?.join(', ') || 'N/A'}</p>
                      <p><span className="text-[#C8A951] font-medium">Four-Wheeler Vehicle Numbers:</span> {bookingData.parkingDetails.vehicleNumbers?.fourWheeler?.join(', ') || 'N/A'}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-cinzel font-semibold text-[#C8A951] border-b border-[#C8A951]/30 pb-2 mb-4" style={{textShadow: '0 0 8px rgba(200, 169, 81, 0.2)'}}>Cost Breakdown</h3>
                <div className="bg-[#121212] border border-[#C8A951]/20 p-5 shadow-lg" style={{boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)'}}>
                  <div className="flex justify-between text-lg font-poppins mb-3">
                    <p className="text-[#F5F5F5]">Movie Seat Cost:</p>
                    <p className="text-[#F5F5F5]">${movieCost}</p>
                  </div>

                  {parkingCost > 0 && (
                    <div className="flex justify-between text-lg font-poppins mb-3">
                      <p className="text-[#F5F5F5]">TAX:</p>
                      <p className="text-[#F5F5F5]">${parkingCost}</p>
                    </div>
                  )}

                  <div className="border-t border-[#C8A951]/30 mt-3 pt-3 flex justify-between text-2xl font-cinzel font-semibold">
                    <p className="text-[#C8A951]">Total Amount:</p>
                    <p className="text-[#C8A951]">${totalAmount}</p>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex justify-center">
                <button
                  onClick={handlePayment}
                  className={`bg-[#0D0D0D] border border-[#C8A951] py-3 px-10 text-[#F5F5F5] font-cinzel font-bold text-lg flex items-center gap-3 transition-all duration-300 hover:bg-[#C8A951]/10 ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  style={{
                    boxShadow: '0 0 15px rgba(200, 169, 81, 0.3)'
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin text-[#C8A951]">
                        <FaCreditCard />
                      </div>
                      <span className="text-[#C8A951]">Processing...</span>
                    </>
                  ) : (
                    <>
                      <FaCreditCard className="text-[#C8A951]" />
                      <span>Confirm Payment</span>
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            <p className="text-center text-lg text-[#E50914] font-playfair mt-8 border border-[#E50914]/30 p-4" style={{boxShadow: '0 0 15px rgba(229, 9, 20, 0.2)'}}>Booking data is missing! Please return to ticket selection.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payment;
