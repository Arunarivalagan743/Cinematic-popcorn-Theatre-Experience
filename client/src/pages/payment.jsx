




// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Swal from 'sweetalert2';
// import { useSelector } from 'react-redux';
// import axios from 'axios';

// const Payment = () => {
//   const [bookingData, setBookingData] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [totalAmount, setTotalAmount] = useState(0);
  
//   const [localParkingDetails, setLocalParkingDetails] = useState({
//         selectedSlot: null, // Ensure selectedSlot is initialized
//       });
//   const { currentUser } = useSelector((state) => state.user); 
//   const selectedSlot = `${localParkingDetails.selectedSlot.twoWheeler}, ${localParkingDetails.selectedSlot.fourWheeler}`;// Getting the current user data
//   const navigate = useNavigate();  // Hook to navigate after payment

//   // Define parking costs
//   const twoWheelerCost = 20;
//   const fourWheelerCost = 30; // Cost for Four-Wheeler parking

//   useEffect(() => {
//     // Fetch booking data from localStorage
//     const data = JSON.parse(localStorage.getItem("bookingData"));

//     // Log bookingData to debug if parking details are missing
//     console.log("Fetched booking data from localStorage:", data);

//     if (data) {
//       setBookingData(data);

//       // Calculate total amount (movie cost + parking cost if any)
//       let movieCost = data.totalCost || 0;
//       let parkingCost = 0;

//       // Check if parking details exist and calculate cost accordingly
//       if (data.parkingDetails) {
//         parkingCost = data.parkingDetails.parkingType === "Two-Wheeler" ? twoWheelerCost : fourWheelerCost;
//         console.log("Parking Type:", data.parkingDetails.parkingType);
//         console.log("Selected Slot:", data.parkingDetails.selectedSlot);
//       }

//       setTotalAmount(movieCost + parkingCost);
//     }
//   }, []);

  
//   const handlePayment = async () => {
//     if (!bookingData) {
//       Swal.fire({
//         icon: 'error',
//         title: 'No booking data!',
//         text: 'There was an issue fetching your booking data. Please try again.',
//         confirmButtonText: 'OK',
//       });
//       return;
//     }
  
//     if (!currentUser) {
//       Swal.fire({
//         icon: 'error',
//         title: 'User not logged in!',
//         text: 'Please log in to complete the payment.',
//         confirmButtonText: 'OK',
//       });
//       return;
//     }
  
//     setIsLoading(true);
//     try {
//       // Attach the current user's email to the booking data
//       const paymentData = { 
//         ...bookingData,
//         userEmail: currentUser.email,
//         parkingDetails: {
//           ...bookingData.parkingDetails,
//           vehicleNumber: localParkingDetails.vehicleNumber, // Add vehicleNumber
//         },
//       };
      
      
//       const response = await axios.post('/api/confirm-payment', {
        
//         bookingData: paymentData,

//       });
      
  
//       if (response.status === 200) {
//         Swal.fire({
//           icon: 'success',
//           title: 'Payment Confirmed!',
//           text: 'Your payment has been successfully processed and a confirmation email has been sent.',
//           confirmButtonText: 'OK',
//         });
  
//         // Clear local storage and redirect to a confirmation page or dashboard
//         localStorage.removeItem('bookingData');
//         navigate('/'); // Redirect to a confirmation page or homepage
//       } else {
//         Swal.fire({
//           icon: 'error',
//           title: 'Payment Failed!',
//           text: 'There was an error processing your payment. Please try again.',
//           confirmButtonText: 'OK',
//         });
//       }
//     } catch (error) {
//       console.error('Error during payment confirmation:', error);
//       Swal.fire({
//         icon: 'error',
//         title: 'Payment Failed!',
//         text: 'An error occurred while processing the payment.',
//         confirmButtonText: 'OK',
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };
  
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-800 text-white p-8">
//       <h1 className="text-3xl font-bold text-center text-yellow-500 mb-6">Payment Details</h1>
//       {currentUser && (
//         <div className="text-center text-lg mb-6 text-green-400">
//           <p>Welcome, {currentUser.email}</p>
//         </div>
//       )}

//       <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
//         {bookingData ? (
//           <>
//             <h2 className="text-xl font-semibold">Booking Details</h2>
//             <p><strong>Movie Title:</strong> {bookingData.movie}</p>
//             <p><strong>Screen:</strong> {bookingData.screen}</p>
//             <p><strong>Show Timing:</strong> {bookingData.timing}</p>
//             <p><strong>Selected Seats:</strong> {bookingData.seats.join(', ')}</p>

//             {bookingData.parkingDetails && (
//   <div className="mt-4">
//     <h3 className="text-lg font-semibold">Parking Details</h3>
//     <p><strong>Parking Type:</strong> {bookingData.parkingDetails.parkingType}</p>
//     <p><strong>Selected Slots (Two-Wheeler):</strong> {bookingData.parkingDetails.selectedSlot?.twoWheeler || 'N/A'}</p>
//     <p><strong>Selected Slots (Four-Wheeler):</strong> {bookingData.parkingDetails.selectedSlot?.fourWheeler || 'N/A'}</p>
//     <p><strong>Two-Wheeler VEHICLE NUMBER:</strong> {bookingData.parkingDetails.vehicleNumbers?.twoWheeler?.join(', ') || 'N/A'}</p>
//     <p><strong>Four-Wheeler VEHICLE NUMBER:</strong> {bookingData.parkingDetails.vehicleNumbers?.fourWheeler?.join(', ') || 'N/A'}</p>
//   </div>
// )}


//             <div className="mt-8">
//               <h2 className="text-2xl font-bold">Total Amount: ${bookingData.totalCost || 0}</h2>
//             </div>

//             <div className="mt-8">
//               <button
//                 onClick={handlePayment}
//                 className={`bg-green-500 py-3 px-8 rounded-lg text-white font-bold ${
//                   isLoading ? 'opacity-50 cursor-not-allowed' : ''
//                 }`}
//                 disabled={isLoading}
//               >
//                 {isLoading ? 'Processing...' : 'Confirm Payment'}
//               </button>
//             </div>
//           </>
//         ) : (
//           <p className="text-center text-lg text-red-500">Booking data is missing!</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Payment;
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import axios from 'axios';

const Payment = () => {
  const [bookingData, setBookingData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);

  const [localParkingDetails, setLocalParkingDetails] = useState({
    selectedSlot: { twoWheeler: 'N/A', fourWheeler: 'N/A' }, // Set default values
  });

  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  // Define parking costs
  const twoWheelerCost = 20;
  const fourWheelerCost = 30; // Cost for Four-Wheeler parking

  useEffect(() => {
    // Fetch booking data from localStorage
    const data = JSON.parse(localStorage.getItem('bookingData'));

    // Log bookingData to debug if parking details are missing
    console.log('Fetched booking data from localStorage:', data);

    if (data) {
      setBookingData(data);

      // Calculate total amount (movie cost + parking cost if any)
      let movieCost = data.totalCost || 0;
      let parkingCost = 0;

      // Check if parking details exist and calculate cost accordingly
      if (data.parkingDetails) {
        parkingCost = data.parkingDetails.parkingType === 'Two-Wheeler' ? twoWheelerCost : fourWheelerCost;
        console.log('Parking Type:', data.parkingDetails.parkingType);
        console.log('Selected Slot:', data.parkingDetails.selectedSlot);
        setLocalParkingDetails({
          selectedSlot: data.parkingDetails.selectedSlot || { twoWheeler: 'N/A', fourWheeler: 'N/A' }, // Default if missing
        });
      }

      setTotalAmount(movieCost + parkingCost);
    }
  }, []);

  const handlePayment = async () => {
    if (!bookingData) {
      Swal.fire({
        icon: 'error',
        title: 'No booking data!',
        text: 'There was an issue fetching your booking data. Please try again.',
        confirmButtonText: 'OK',
      });
      return;
    }

    if (!currentUser) {
      Swal.fire({
        icon: 'error',
        title: 'User not logged in!',
        text: 'Please log in to complete the payment.',
        confirmButtonText: 'OK',
      });
      return;
    }

    setIsLoading(true);
    try {
      // Attach the current user's email to the booking data
      const paymentData = { 
        ...bookingData,
        userEmail: currentUser.email,
        parkingDetails: {
          ...bookingData.parkingDetails,
          vehicleNumber: localParkingDetails.vehicleNumber, // Add vehicleNumber
        },
      };

      const response = await axios.post('/api/confirm-payment', {
        bookingData: paymentData,
      });

      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Payment Confirmed!',
          text: 'Your payment has been successfully processed and a confirmation email has been sent.',
          confirmButtonText: 'OK',
        });

        // Clear local storage and redirect to a confirmation page or dashboard
        localStorage.removeItem('bookingData');
        navigate('/'); // Redirect to a confirmation page or homepage
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Payment Failed!',
          text: 'There was an error processing your payment. Please try again.',
          confirmButtonText: 'OK',
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 text-white p-8">
      <h1 className="text-3xl font-bold text-center text-yellow-500 mb-6">Payment Details</h1>
      {currentUser && (
        <div className="text-center text-lg mb-6 text-green-400">
          <p>Welcome, {currentUser.email}</p>
        </div>
      )}

      <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
        {bookingData ? (
          <>
            <h2 className="text-xl font-semibold">Booking Details</h2>
            <p><strong>Movie Title:</strong> {bookingData.movie}</p>
            <p><strong>Screen:</strong> {bookingData.screen}</p>
            <p><strong>Show Timing:</strong> {bookingData.timing}</p>
            <p><strong>Selected Seats:</strong> {bookingData.seats.join(', ')}</p>

            {bookingData.parkingDetails && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold">Parking Details</h3>
                <p><strong>Parking Type:</strong> {bookingData.parkingDetails.parkingType}</p>
                <p><strong>Selected Slots (Two-Wheeler):</strong> {localParkingDetails.selectedSlot?.twoWheeler || 'N/A'}</p>
                <p><strong>Selected Slots (Four-Wheeler):</strong> {localParkingDetails.selectedSlot?.fourWheeler || 'N/A'}</p>
                <p><strong>Two-Wheeler VEHICLE NUMBER:</strong> {bookingData.parkingDetails.vehicleNumbers?.twoWheeler?.join(', ') || 'N/A'}</p>
                <p><strong>Four-Wheeler VEHICLE NUMBER:</strong> {bookingData.parkingDetails.vehicleNumbers?.fourWheeler?.join(', ') || 'N/A'}</p>
              </div>
            )}

            <div className="mt-8">
              <h2 className="text-2xl font-bold">Total Amount: ${bookingData.totalCost || 0}</h2>
            </div>

            <div className="mt-8">
              <button
                onClick={handlePayment}
                className={`bg-green-500 py-3 px-8 rounded-lg text-white font-bold ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Confirm Payment'}
              </button>
            </div>
          </>
        ) : (
          <p className="text-center text-lg text-red-500">Booking data is missing!</p>
        )}
      </div>
    </div>
  );
};

export default Payment;
