
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import Swal from 'sweetalert2';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faDollarSign, faCar, faMotorcycle } from '@fortawesome/free-solid-svg-icons';

// const Tickets = () => {
//   const { movie, screen, timing } = useParams();
//   const navigate = useNavigate();
//   const seatPrice = 3;
//   const twoWheelerPrice = 20;
//   const fourWheelerPrice = 30;
//   const totalSeats = 84;
//   const [selectedSeats, setSelectedSeats] = useState([]);
//   const [totalCost, setTotalCost] = useState(0);
//   const [showParkingPrompt, setShowParkingPrompt] = useState(false);
//   const [phone, setPhone] = useState("");
//   const [vehicleNumbers, setVehicleNumbers] = useState({ twoWheeler: [], fourWheeler: [] });
//   const [selectedTwoWheelerSlots, setSelectedTwoWheelerSlots] = useState([]);
//   const [selectedFourWheelerSlots, setSelectedFourWheelerSlots] = useState([]);
//   const [parkingNeeded, setParkingNeeded] = useState(null);
//   const seatStatuses = Array(totalSeats).fill(true);
//   const rowLabels = ['A', 'B', 'C', 'D', 'E', 'F'];
//   const twoWheelerSlots = ["T1", "T2", "T3", "T4"];
//   const fourWheelerSlots = ["F1", "F2", "F3", "F4"];

//   const parkingCost =
//     selectedTwoWheelerSlots.length * twoWheelerPrice +
//     selectedFourWheelerSlots.length * fourWheelerPrice;

//   useEffect(() => {
//     const seatCost = selectedSeats.length * seatPrice;
//     setTotalCost(seatCost + parkingCost);
//   }, [selectedSeats, selectedTwoWheelerSlots, selectedFourWheelerSlots]);

//   useEffect(() => {
//     if (!movie || !screen || !timing) {
//       navigate("/error");
//     }
//   }, [movie, screen, timing]);

//   const handleSeatSelection = (index) => {
//     if (seatStatuses[index]) {
//       setSelectedSeats((prev) =>
//         prev.includes(index) ? prev.filter((seat) => seat !== index) : [...prev, index]
//       );
//     }
//   };

//   const handleSlotSelection = (slot, type) => {
//     if (type === "Two-Wheeler") {
//       setSelectedTwoWheelerSlots((prev) =>
//         prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
//       );
//     } else if (type === "Four-Wheeler") {
//       setSelectedFourWheelerSlots((prev) =>
//         prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
//       );
//     }
//   };

//   const handleConfirm = async () => {
//     if (selectedSeats.length === 0) {
//       Swal.fire('Error', 'Please select at least one seat!', 'error');
//       return;
//     }

//     const actualSeats = selectedSeats.map(index => {
//       const row = rowLabels[Math.floor(index / 8)];
//       const seatNumber = (index % 8) + 1;
//       return `${row}${seatNumber}`;
//     });

//     const movieConfirmation = await Swal.fire({
//       title: 'Confirm Movie Booking',
//       html: 
//         `<p>Movie: ${movie}</p>
//         <p>Screen: ${screen}</p>
//         <p>Timing: ${timing}</p>
//         <p>Seats: ${actualSeats.join(', ')}</p>
//         <p>Total Seat Cost: $${selectedSeats.length * seatPrice}</p>`,
//       icon: 'info',
//       showCancelButton: true,
//       confirmButtonText: 'Next',
//       cancelButtonText: 'Cancel',
//     });

//     if (!movieConfirmation.isConfirmed) return;

//     const parkingResult = await Swal.fire({
//       title: 'Parking Assistance Required?',
//       text: 'Do you need parking assistance?',
//       icon: 'question',
//       showCancelButton: true,
//       confirmButtonText: 'Yes',
//       cancelButtonText: 'No',
//     });

//     if (parkingResult.isConfirmed) {
//       setShowParkingPrompt(true);
//       setParkingNeeded(true);
//     } else {
//       setShowParkingPrompt(false);
//       setParkingNeeded(false);
//       handleFinalConfirmation();
//     }
//   };

//   const handleFinalConfirmation = async () => {
//     const actualSeats = selectedSeats.map(index => {
//       const row = rowLabels[Math.floor(index / 8)];
//       const seatNumber = (index % 8) + 1;
//       return `${row}${seatNumber}`;
//     });

//     const parkingDetails = parkingNeeded
//       ? `<br>Phone: ${phone}<br>Vehicle Numbers: Two-Wheeler: ${vehicleNumbers.twoWheeler.join(', ')} Four-Wheeler: ${vehicleNumbers.fourWheeler.join(', ')}<br>Parking Cost: $${parkingCost}`
//       : '';

//     const result = await Swal.fire({
//       title: 'Confirm Booking',
//       html: 
//         `<p>Movie: ${movie}</p>
//         <p>Screen: ${screen}</p>
//         <p>Timing: ${timing}</p>
//         <p>Seats: ${actualSeats.join(', ')}</p>
//         <p>Total Seat Cost: $${selectedSeats.length * seatPrice}</p>
//         ${parkingDetails}
//         <p>Total Cost: $${totalCost}</p>`,
//       icon: 'info',
//       showCancelButton: true,
//       confirmButtonText: 'Proceed to Payment',
//       cancelButtonText: 'Cancel',
//     });

//     if (result.isConfirmed) {
//       const bookingData = {
//         movie,
//         screen,
//         timing,
//         seats: actualSeats,
//         totalCost,
//         parkingDetails: parkingNeeded
//           ? {
//               phone,
//               vehicleNumbers,
//               parkingCost,
//             }
//           : null,
//       };

//       localStorage.setItem("bookingData", JSON.stringify(bookingData));
//       navigate(`/payment?movie=${movie}&screen=${screen}&timing=${timing}&totalCost=${totalCost}`);
//     }
//   };

//   // Handle vehicle number input dynamically
//   const handleVehicleNumberChange = (e, type, index) => {
//     const newVehicleNumbers = { ...vehicleNumbers };
//     newVehicleNumbers[type][index] = e.target.value;
//     setVehicleNumbers(newVehicleNumbers);
//   };

//   const handleConfirmParking = () => {
//     handleFinalConfirmation();
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-800 text-white p-4 lg:p-8">
//       <h1 className="text-3xl font-bold text-center text-yellow-500 mb-6">
//         {movie} - Screen {screen} - {timing}
//       </h1>

//       <div className="flex justify-center mb-4">
//         <div className="bg-gray-800 text-white w-full text-center p-2 rounded-lg shadow-lg font-semibold">
//           <p className="text-xl">Movie Screen</p>
//         </div>
//       </div>

//       <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-3 mx-auto max-w-full">
//         {seatStatuses.map((isAvailable, index) => {
//           const row = rowLabels[Math.floor(index / 8)];
//           const seatNumber = (index % 8) + 1;
//           return (
//             <div
//               key={index}
//               className={`cursor-pointer flex items-center justify-center p-3 rounded-lg 
//                 ${selectedSeats.includes(index) ? 'bg-green-500 text-white' : 
//                   isAvailable ? 'bg-gray-600 text-gray-200 hover:bg-gray-500' : 
//                   'bg-red-600 text-gray-300 cursor-not-allowed'}`}
//               onClick={() => handleSeatSelection(index)}
//             >
//               {`${row}${seatNumber}`}
//             </div>
//           );
//         })}
//       </div>

//       {selectedSeats.length > 0 && (
//         <div className="mt-8 text-center">
//           <button
//             onClick={handleConfirm}
//             className="bg-gradient-to-r from-yellow-500 to-red-500 hover:from-red-500 hover:to-yellow-500 text-white px-6 py-3 rounded-full text-lg font-bold transition duration-300 ease-in-out transform hover:scale-105"
//           >
//             Confirm Booking
//           </button>
//         </div>
//       )}
// {showParkingPrompt && (
//   <div className="mt-8 animate__animated animate__fadeIn animate__delay-1s">
//     <h3 className="text-xl mb-4 text-center font-semibold text-yellow-300">Parking Details</h3>
    
//     <div className="space-y-4">
//       {/* Phone Number Section */}
//       <div className="transition-all duration-300 ease-in-out transform hover:scale-105">
//         <label htmlFor="phone" className="block text-white">Phone Number</label>
//         <input
//           type="tel"
//           id="phone"
//           value={phone}
//           onChange={(e) => setPhone(e.target.value)}
//           className="p-3 bg-gray-700 text-white rounded-lg w-full transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-yellow-500"
//           maxLength={10}
//           required
//         />
//       </div>

//       {/* Two-Wheeler Parking Section */}
//       <div className="transition-all duration-300 ease-in-out transform hover:scale-105">
//         <h4 className="text-lg mb-2 text-white">Select Two-Wheeler Parking</h4>
//         {twoWheelerSlots.map((slot, index) => (
//           <div key={index} className="flex items-center space-x-2 mb-3">
//             <input
//               type="checkbox"
//               id={`twoWheeler${index}`}
//               checked={selectedTwoWheelerSlots.includes(slot)}
//               onChange={() => handleSlotSelection(slot, "Two-Wheeler")}
//               className="transition-all duration-200 ease-in-out transform hover:scale-105"
//             />
//             <label htmlFor={`twoWheeler${index}`} className="text-white">{slot}</label>
//             {selectedTwoWheelerSlots.includes(slot) && (
//               <div className="mt-2">
//                 <label className="block text-white">Enter Vehicle Number:</label>
//                 <input
//                   type="text"
//                   className="p-3 bg-gray-700 text-white rounded-lg w-full transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-yellow-500"
//                   value={vehicleNumbers.twoWheeler[index] || ""}
//                   onChange={(e) => handleVehicleNumberChange(e, "twoWheeler", index)}
//                   required
//                 />
//               </div>
//             )}
//           </div>
//         ))}
//       </div>

//       {/* Four-Wheeler Parking Section */}
//       <div className="transition-all duration-300 ease-in-out transform hover:scale-105">
//         <h4 className="text-lg mb-2 text-white">Select Four-Wheeler Parking</h4>
//         {fourWheelerSlots.map((slot, index) => (
//           <div key={index} className="flex items-center space-x-2 mb-3">
//             <input
//               type="checkbox"
//               id={`fourWheeler${index}`}
//               checked={selectedFourWheelerSlots.includes(slot)}
//               onChange={() => handleSlotSelection(slot, "Four-Wheeler")}
//               className="transition-all duration-200 ease-in-out transform hover:scale-105"
//             />
//             <label htmlFor={`fourWheeler${index}`} className="text-white">{slot}</label>
//             {selectedFourWheelerSlots.includes(slot) && (
//               <div className="mt-2">
//                 <label className="block text-white">Enter Vehicle Number:</label>
//                 <input
//                   type="text"
//                   className="p-3 bg-gray-700 text-white rounded-lg w-full transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-yellow-500"
//                   value={vehicleNumbers.fourWheeler[index] || ""}
//                   onChange={(e) => handleVehicleNumberChange(e, "fourWheeler", index)}
//                   required
//                 />
//               </div>
//             )}
//           </div>
//         ))}
//       </div>

//       {/* Confirm Button */}
//       <div className="mt-4">
//         <button
//           onClick={handleConfirmParking}
//           className="bg-gradient-to-r from-green-500 to-yellow-500 text-white px-6 py-3 rounded-full text-lg font-bold transition duration-300 ease-in-out hover:scale-105 hover:shadow-2xl"
//         >
//           Confirm Parking
//         </button>
//       </div>
//     </div>
//   </div>
// )}

// export default Tickets;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign, faCar, faMotorcycle } from '@fortawesome/free-solid-svg-icons';

const Tickets = () => {
  const { movie, screen, timing } = useParams();
  const navigate = useNavigate();
  const seatPrice = 3;
  const twoWheelerPrice = 20;
  const fourWheelerPrice = 30;
  const totalSeats = 84;
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [showParkingPrompt, setShowParkingPrompt] = useState(false);
  const [phone, setPhone] = useState("");
  const [vehicleNumbers, setVehicleNumbers] = useState({ twoWheeler: [], fourWheeler: [] });
  const [selectedTwoWheelerSlots, setSelectedTwoWheelerSlots] = useState([]);
  const [selectedFourWheelerSlots, setSelectedFourWheelerSlots] = useState([]);
  const [parkingNeeded, setParkingNeeded] = useState(null);
  const seatStatuses = Array(totalSeats).fill(true);
  const rowLabels = ['A', 'B', 'C', 'D', 'E', 'F'];
  const twoWheelerSlots = ["T1", "T2", "T3", "T4"];
  const fourWheelerSlots = ["F1", "F2", "F3", "F4"];

  const parkingCost =
    selectedTwoWheelerSlots.length * twoWheelerPrice +
    selectedFourWheelerSlots.length * fourWheelerPrice;

  useEffect(() => {
    const seatCost = selectedSeats.length * seatPrice;
    setTotalCost(seatCost + parkingCost);
  }, [selectedSeats, selectedTwoWheelerSlots, selectedFourWheelerSlots]);

  useEffect(() => {
    if (!movie || !screen || !timing) {
      navigate("/error");
    }
  }, [movie, screen, timing]);

  const handleSeatSelection = (index) => {
    if (seatStatuses[index]) {
      setSelectedSeats((prev) =>
        prev.includes(index) ? prev.filter((seat) => seat !== index) : [...prev, index]
      );
    }
  };

  const handleSlotSelection = (slot, type) => {
    if (type === "Two-Wheeler") {
      setSelectedTwoWheelerSlots((prev) =>
        prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
      );
    } else if (type === "Four-Wheeler") {
      setSelectedFourWheelerSlots((prev) =>
        prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
      );
    }
  };

  const handleConfirm = async () => {
    if (selectedSeats.length === 0) {
      Swal.fire('Error', 'Please select at least one seat!', 'error');
      return;
    }

    const actualSeats = selectedSeats.map(index => {
      const row = rowLabels[Math.floor(index / 8)];
      const seatNumber = (index % 8) + 1;
      return `${row}${seatNumber}`;
    });

    const movieConfirmation = await Swal.fire({
      title: 'Confirm Movie Booking',
      html: 
        `<p>Movie: ${movie}</p>
        <p>Screen: ${screen}</p>
        <p>Timing: ${timing}</p>
        <p>Seats: ${actualSeats.join(', ')}</p>
        <p>Total Seat Cost: $${selectedSeats.length * seatPrice}</p>`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Next',
      cancelButtonText: 'Cancel',
    });

    if (!movieConfirmation.isConfirmed) return;

    const parkingResult = await Swal.fire({
      title: 'Parking Assistance Required?',
      text: 'Do you need parking assistance?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    });

    if (parkingResult.isConfirmed) {
      setShowParkingPrompt(true);
      setParkingNeeded(true);
    } else {
      setShowParkingPrompt(false);
      setParkingNeeded(false);
      handleFinalConfirmation();
    }
  };

  // const handleFinalConfirmation = async () => {
  //   const actualSeats = selectedSeats.map(index => {
  //     const row = rowLabels[Math.floor(index / 8)];
  //     const seatNumber = (index % 8) + 1;
  //     return `${row}${seatNumber}`;
  //   });

  //   const parkingDetails = parkingNeeded
  //     ? `<br>Phone: ${phone}<br>Vehicle Numbers: Two-Wheeler: ${vehicleNumbers.twoWheeler.join(', ')} Four-Wheeler: ${vehicleNumbers.fourWheeler.join(', ')}<br>Parking Cost: $${parkingCost}`
  //     : '';

  //   const result = await Swal.fire({
  //     title: 'Confirm Booking',
  //     html: 
  //       `<p>Movie: ${movie}</p>
  //       <p>Screen: ${screen}</p>
  //       <p>Timing: ${timing}</p>
  //       <p>Seats: ${actualSeats.join(', ')}</p>
  //       <p>Total Seat Cost: $${selectedSeats.length * seatPrice}</p>
  //       ${parkingDetails}
  //       <p>Total Cost: $${totalCost}</p>`,
  //     icon: 'info',
  //     showCancelButton: true,
  //     confirmButtonText: 'Proceed to Payment',
  //     cancelButtonText: 'Cancel',
  //   });

  //   if (result.isConfirmed) {
  //     const bookingData = {
  //       movie,
  //       screen,
  //       timing,
  //       seats: actualSeats,
  //       totalCost,
  //       parkingDetails: parkingNeeded
  //         ? {
  //             phone,
  //             vehicleNumbers,
  //             parkingCost,
  //           }
  //         : null,
  //     };

  //     localStorage.setItem("bookingData", JSON.stringify(bookingData));
  //     navigate(`/payment?movie=${movie}&screen=${screen}&timing=${timing}&totalCost=${totalCost}`);
  //   }
  // };
  const handleFinalConfirmation = async () => {
    const actualSeats = selectedSeats.map(index => {
      const row = rowLabels[Math.floor(index / 8)];
      const seatNumber = (index % 8) + 1;
      return `${row}${seatNumber}`;
    });
  
    const parkingDetails = parkingNeeded
      ? {
          phone,
          vehicleNumbers,
          parkingCost,
        }
      : null;
  
    const result = await Swal.fire({
      title: 'Confirm Booking',
      html: 
        `<p>Movie: ${movie}</p>
        <p>Screen: ${screen}</p>
        <p>Timing: ${timing}</p>
        <p>Seats: ${actualSeats.join(', ')}</p>
        <p>Total Seat Cost: $${selectedSeats.length * seatPrice}</p>
        ${parkingDetails ? `<p>Parking Cost: $${parkingCost}</p>` : ''}
        <p>Total Cost: $${totalCost}</p>`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Proceed to Payment',
      cancelButtonText: 'Cancel',
    });
  
    if (result.isConfirmed) {
      const bookingData = {
        movie,
        screen,
        timing,
        seats: actualSeats,
        totalCost,
        parkingDetails,
         // Assume user email is stored or fetched from a logged-in user
      };
  
      // Send the booking data to the backend
      try {
        const response = await fetch('/api/bookings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bookingData),
        });
  
        if (response.ok) {
          localStorage.setItem("bookingData", JSON.stringify(bookingData));
          navigate(`/payment?movie=${movie}&screen=${screen}&timing=${timing}&totalCost=${totalCost}`);
        } else {
          throw new Error('Error booking the ticket');
        }
      } catch (error) {
        Swal.fire('Error', 'There was an issue confirming your booking', 'error');
      }
    }
  };
  
  // Handle vehicle number input dynamically
  const handleVehicleNumberChange = (e, type, index) => {
    const newVehicleNumbers = { ...vehicleNumbers };
    newVehicleNumbers[type][index] = e.target.value;
    setVehicleNumbers(newVehicleNumbers);
  };
  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;
    // Validate phone number (only 10 digits allowed)
    if (/^\d{10}$/.test(value)) {
      setPhone(value);
    } else {
      Swal.fire('Error', 'Please enter a valid 10-digit phone number.', 'error');
    }
  };
  
  const handleConfirmParking = () => {
    // Validate phone number and vehicle numbers
    if (!phone) {
      Swal.fire('Error', 'Please enter your phone number.', 'error');
      return;
    }
  
    // Check if two-wheeler vehicle numbers are provided
    if (selectedTwoWheelerSlots.length > 0 && selectedTwoWheelerSlots.some((_, index) => !vehicleNumbers.twoWheeler[index])) {
      Swal.fire('Error', 'Please enter vehicle numbers for all selected two-wheeler parking slots.', 'error');
      return;
    }
  
    // Check if four-wheeler vehicle numbers are provided
    if (selectedFourWheelerSlots.length > 0 && selectedFourWheelerSlots.some((_, index) => !vehicleNumbers.fourWheeler[index])) {
      Swal.fire('Error', 'Please enter vehicle numbers for all selected four-wheeler parking slots.', 'error');
      return;
    }
  
    // If all validations pass, proceed to the final confirmation
    handleFinalConfirmation();
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 text-white p-4 lg:p-8">
      <h1 className="text-3xl font-bold text-center text-yellow-500 mb-6">
        {movie} - Screen {screen} - {timing}
      </h1>

      <div className="flex justify-center mb-4">
        <div className="bg-gray-800 text-white w-full text-center p-2 rounded-lg shadow-lg font-semibold">
          <p className="text-xl">Movie Screen</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-3 mx-auto max-w-full">
        {seatStatuses.map((isAvailable, index) => {
          const row = rowLabels[Math.floor(index / 8)];
          const seatNumber = (index % 8) + 1;
          return (
            <div
              key={index}
              className={`cursor-pointer flex items-center justify-center p-3 rounded-lg 
                ${selectedSeats.includes(index) ? 'bg-green-500 text-white' : 
                  isAvailable ? 'bg-gray-600 text-gray-200 hover:bg-gray-500' : 
                  'bg-red-600 text-gray-300 cursor-not-allowed'}`}
              onClick={() => handleSeatSelection(index)}
            >
              {`${row}${seatNumber}`}
            </div>
          );
        })}
      </div>

      {selectedSeats.length > 0 && (
        <div className="mt-8 text-center">
          <button
            onClick={handleConfirm}
            className="bg-gradient-to-r from-yellow-500 to-red-500 hover:from-red-500 hover:to-yellow-500 text-white px-6 py-3 rounded-full text-lg font-bold transition duration-300 ease-in-out transform hover:scale-105"
          >
            Confirm Booking
          </button>
        </div>
      )}

      {showParkingPrompt && (
        <div className="mt-8 animate__animated animate__fadeIn animate__delay-1s">
          <h3 className="text-xl mb-4 text-center font-semibold text-yellow-300">Parking Details</h3>

          <div className="space-y-4">
            {/* Phone Number Section */}
            <div className="transition-all duration-300 ease-in-out transform hover:scale-105">
              <label htmlFor="phone" className="block text-white">Phone Number</label>
              <input
                id="phone"
                type="text"
                maxLength={10}
                className="w-full p-2 bg-gray-700 text-white rounded-md"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter phone number"
              />
            </div>

            {/* Two-Wheeler Slots */}
            <div className="space-y-2">
              <p className="text-white">Select Two-Wheeler Parking Slots</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {twoWheelerSlots.map((slot) => (
                  <button
                    key={slot}
                    className={`${
                      selectedTwoWheelerSlots.includes(slot)
                        ? 'bg-green-500'
                        : 'bg-gray-700'
                    } px-4 py-2 rounded-md text-white`}
                    onClick={() => handleSlotSelection(slot, "Two-Wheeler")}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* Four-Wheeler Slots */}
            <div className="space-y-2">
              <p className="text-white">Select Four-Wheeler Parking Slots</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {fourWheelerSlots.map((slot) => (
                  <button
                    key={slot}
                    className={`${
                      selectedFourWheelerSlots.includes(slot)
                        ? 'bg-green-500'
                        : 'bg-gray-700'
                    } px-4 py-2 rounded-md text-white`}
                    onClick={() => handleSlotSelection(slot, "Four-Wheeler")}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* Vehicle Number Inputs */}
            {selectedTwoWheelerSlots.length > 0 && (
              <div className="transition-all duration-300 ease-in-out">
                <label htmlFor="two-wheeler-vehicles" className="block text-white">Enter Two-Wheeler Vehicle Numbers</label>
                {selectedTwoWheelerSlots.map((slot, index) => (
                  <input
                    key={index}
                    type="text"
                    className="w-full p-2 bg-gray-700 text-white rounded-md mt-2"
                    placeholder={`Vehicle for ${slot}`}
                    value={vehicleNumbers.twoWheeler[index] || ''}
                    onChange={(e) => handleVehicleNumberChange(e, 'twoWheeler', index)}
                  />
                ))}
              </div>
            )}

            {selectedFourWheelerSlots.length > 0 && (
              <div className="transition-all duration-300 ease-in-out">
                <label htmlFor="four-wheeler-vehicles" className="block text-white">Enter Four-Wheeler Vehicle Numbers</label>
                {selectedFourWheelerSlots.map((slot, index) => (
                  <input
                    key={index}
                    type="text"
                    className="w-full p-2 bg-gray-700 text-white rounded-md mt-2"
                    placeholder={`Vehicle for ${slot}`}
                    value={vehicleNumbers.fourWheeler[index] || ''}
                    onChange={(e) => handleVehicleNumberChange(e, 'fourWheeler', index)}
                  />
                ))}
              </div>
            )}

            <div className="mt-4 text-center">
              <button
                onClick={handleConfirmParking}
                className="bg-gradient-to-r from-yellow-500 to-red-500 hover:from-red-500 hover:to-yellow-500 text-white px-6 py-3 rounded-full text-lg font-bold transition duration-300 ease-in-out transform hover:scale-105"
              >
                Confirm Parking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tickets;
