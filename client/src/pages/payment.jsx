// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';  // To navigate after payment confirmation

// const Payment = () => {
//   const [bookingData, setBookingData] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [totalAmount, setTotalAmount] = useState(0);
//   const navigate = useNavigate();  // Hook to navigate after payment

//   // Define parking costs
//   const twoWheelerCost = 5; // Cost for Two-Wheeler parking
//   const fourWheelerCost = 10; // Cost for Four-Wheeler parking

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

//   // Function to handle payment confirmation
//   const handlePayment = async () => {
//     setIsLoading(true);
//     try {
//       // Sending booking data to the server to confirm payment
//       const response = await axios.post('http://localhost:5000/api/confirm-payment', {
//         bookingData
//       });

//       if (response.status === 200) {
//         alert('Payment confirmed successfully!');
//         // Clear local storage and redirect to a confirmation page or dashboard
//         localStorage.removeItem('bookingData');
//         // Redirect to a confirmation page or dashboard
//         // Redirect to confirmation page
//       } else {
//         alert('Failed to confirm payment. Please try again.');
//       }
//     } catch (error) {
//       console.error('Error during payment confirmation:', error);
//       alert('An error occurred while processing the payment.');
//     } finally {
//       setIsLoading(false);
//     }
//   };



//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-800 text-white p-8">
//       <h1 className="text-3xl font-bold text-center text-yellow-500 mb-6">Payment Details</h1>

//       <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
//         <h2 className="text-xl font-semibold">Booking Details</h2>
//         <p><strong>Movie Title:</strong> {bookingData.movie}</p>
//         <p><strong>Screen:</strong> {bookingData.screen}</p>
//         <p><strong>Show Timing:</strong> {bookingData.timing}</p>
//         <p><strong>Selected Seats:</strong> {bookingData.seats.join(', ')}</p>
//         <p><strong>Seat Cost:</strong> ${bookingData.totalCost}</p>

//         {bookingData.parkingDetails && (
//           <div className="mt-4">
//             <h3 className="text-lg font-semibold">Parking Details</h3>
//             <p><strong>Parking Type:</strong> {bookingData.parkingDetails.parkingType}</p>
//             <p><strong>Selected Slot:</strong> {bookingData.parkingDetails.selectedSlot}</p>
//             <p><strong>Contact Phone:</strong> {bookingData.parkingDetails.phone}</p>
//             <p><strong>Vehicle Number:</strong> {bookingData.parkingDetails.vehicleNumber}</p>
//             <p>
//               <strong>Parking Cost:</strong> $
//               {bookingData.parkingDetails.parkingType === "Two-Wheeler" ? twoWheelerCost : fourWheelerCost}
//             </p>
//           </div>
//         )}

//         <div className="mt-8">
//           <h2 className="text-2xl font-bold">Total Amount: ${totalAmount}</h2>
//         </div>

//         <div className="mt-8">
//           <button
//             onClick={handlePayment}
//             className={`bg-green-500 py-3 px-8 rounded-lg text-white font-bold ${
//               isLoading ? 'opacity-50 cursor-not-allowed' : ''
//             }`}
//             disabled={isLoading}
//           >
//             {isLoading ? 'Processing...' : 'Confirm Payment'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Payment;
// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';  // To navigate after payment confirmation
// import Swal from 'sweetalert2';  // Import SweetAlert2

// const Payment = () => {
//   const [bookingData, setBookingData] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [totalAmount, setTotalAmount] = useState(0);
//   const navigate = useNavigate();  // Hook to navigate after payment

//   // Define parking costs
//   const twoWheelerCost = 5; // Cost for Two-Wheeler parking
//   const fourWheelerCost = 10; // Cost for Four-Wheeler parking

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

//   // Function to handle payment confirmation
//   const handlePayment = async () => {
//     setIsLoading(true);
//     try {
//       // Sending booking data to the server to confirm payment
//       const response = await axios.post('http://localhost:5000/api/confirm-payment', {
//         bookingData
//       });

//       if (response.status === 200) {
//         // Show SweetAlert success notification
//         Swal.fire({
//           icon: 'success',
//           title: 'Payment Confirmed!',
//           text: 'Your payment has been successfully processed.',
//           confirmButtonText: 'OK',
//         });

//         // Send notification to the registered phone number (you can implement this on the backend)
//         const phoneNotificationResponse = await axios.post('http://localhost:5000/api/send-phone-notification', {
//           phone: bookingData.parkingDetails.phone,
//           message: `Payment confirmed for your booking at ${bookingData.movie} on ${bookingData.timing}. Parking slot: ${bookingData.parkingDetails.selectedSlot}.`
//         });

//         // If phone notification is successful, log a success message
//         if (phoneNotificationResponse.status === 200) {
//           console.log("Phone notification sent successfully!");
//         } else {
//           console.error("Failed to send phone notification.");
//         }

//         // Clear local storage and redirect to a confirmation page or dashboard
//         localStorage.removeItem('bookingData');
//         // Redirect to confirmation page (or any other page)
//         navigate('/confirmation'); // Example of redirection to a confirmation page
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

//       <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
//         <h2 className="text-xl font-semibold">Booking Details</h2>
//         <p><strong>Movie Title:</strong> {bookingData.movie}</p>
//         <p><strong>Screen:</strong> {bookingData.screen}</p>
//         <p><strong>Show Timing:</strong> {bookingData.timing}</p>
//         <p><strong>Selected Seats:</strong> {bookingData.seats.join(', ')}</p>
//         <p><strong>Seat Cost:</strong> ${bookingData.totalCost}</p>

//         {bookingData.parkingDetails && (
//           <div className="mt-4">
//             <h3 className="text-lg font-semibold">Parking Details</h3>
//             <p><strong>Parking Type:</strong> {bookingData.parkingDetails.parkingType}</p>
//             <p><strong>Selected Slot:</strong> {bookingData.parkingDetails.selectedSlot}</p>
//             <p><strong>Contact Phone:</strong> {bookingData.parkingDetails.phone}</p>
//             <p><strong>Vehicle Number:</strong> {bookingData.parkingDetails.vehicleNumber}</p>
//             <p>
//               <strong>Parking Cost:</strong> $
//               {bookingData.parkingDetails.parkingType === "Two-Wheeler" ? twoWheelerCost : fourWheelerCost}
//             </p>
//           </div>
//         )}

//         <div className="mt-8">
//           <h2 className="text-2xl font-bold">Total Amount: ${totalAmount}</h2>
//         </div>

//         <div className="mt-8">
//           <button
//             onClick={handlePayment}
//             className={`bg-green-500 py-3 px-8 rounded-lg text-white font-bold ${
//               isLoading ? 'opacity-50 cursor-not-allowed' : ''
//             }`}
//             disabled={isLoading}
//           >
//             {isLoading ? 'Processing...' : 'Confirm Payment'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Payment;
import  { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import axios from 'axios';
 const Payment = () => {
  const [bookingData, setBookingData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const navigate = useNavigate();  // Hook to navigate after payment

  // Define parking costs
  const twoWheelerCost = 5; // Cost for Two-Wheeler parking
  const fourWheelerCost = 10; // Cost for Four-Wheeler parking

  useEffect(() => {
    // Fetch booking data from localStorage
    const data = JSON.parse(localStorage.getItem("bookingData"));

    // Log bookingData to debug if parking details are missing
    console.log("Fetched booking data from localStorage:", data);

    if (data) {
      setBookingData(data);

      // Calculate total amount (movie cost + parking cost if any)
      let movieCost = data.totalCost || 0;
      let parkingCost = 0;

      // Check if parking details exist and calculate cost accordingly
      if (data.parkingDetails) {
        parkingCost = data.parkingDetails.parkingType === "Two-Wheeler" ? twoWheelerCost : fourWheelerCost;
        console.log("Parking Type:", data.parkingDetails.parkingType);
        console.log("Selected Slot:", data.parkingDetails.selectedSlot);
      }

      setTotalAmount(movieCost + parkingCost);
    }
  }, []);

  // Function to handle payment confirmation
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

    setIsLoading(true);
    try {
      // Sending booking data to the server to confirm payment
      const response = await axios.post('http://localhost:5000/api/confirm-payment', {
        bookingData
      });

      if (response.status === 200) {
        // Show SweetAlert success notification
        Swal.fire({
          icon: 'success',
          title: 'Payment Confirmed!',
          text: 'Your payment has been successfully processed.',
          confirmButtonText: 'OK',
        });

        // Send notification to the registered phone number (you can implement this on the backend)
        const phoneNotificationResponse = await axios.post('http://localhost:5000/api/send-phone-notification', {
          phone: bookingData.parkingDetails.phone,
          message: `Payment confirmed for your booking at ${bookingData.movie} on ${bookingData.timing}. Parking slot: ${bookingData.parkingDetails.selectedSlot}.`
        });

        // If phone notification is successful, log a success message
        if (phoneNotificationResponse.status === 200) {
          console.log("Phone notification sent successfully!");
        } else {
          console.error("Failed to send phone notification.");
        }

        // Clear local storage and redirect to a confirmation page or dashboard
        localStorage.removeItem('bookingData');
        // Redirect to confirmation page (or any other page)
        navigate('/confirmation'); // Example of redirection to a confirmation page
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

      <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
        {bookingData ? (
          <>
            <h2 className="text-xl font-semibold">Booking Details</h2>
            <p><strong>Movie Title:</strong> {bookingData.movie}</p>
            <p><strong>Screen:</strong> {bookingData.screen}</p>
            <p><strong>Show Timing:</strong> {bookingData.timing}</p>
            <p><strong>Selected Seats:</strong> {bookingData.seats.join(', ')}</p>
            <p><strong>Seat Cost:</strong> ${bookingData.totalCost}</p>

            {bookingData.parkingDetails && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold">Parking Details</h3>
                <p><strong>Parking Type:</strong> {bookingData.parkingDetails.parkingType}</p>
                <p><strong>Selected Slot:</strong> {bookingData.parkingDetails.selectedSlot}</p>
                <p><strong>Contact Phone:</strong> {bookingData.parkingDetails.phone}</p>
                <p><strong>Vehicle Number:</strong> {bookingData.parkingDetails.vehicleNumber}</p>
                <p>
                  <strong>Parking Cost:</strong> $
                  {bookingData.parkingDetails.parkingType === "Two-Wheeler" ? twoWheelerCost : fourWheelerCost}
                </p>
              </div>
            )}

            <div className="mt-8">
              <h2 className="text-2xl font-bold">Total Amount: ${totalAmount}</h2>
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