






// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faChair, faDollarSign, faFilm, faTimes } from '@fortawesome/free-solid-svg-icons';

// const Tickets = () => {
//   const { movie, screen, timing } = useParams();
//   const navigate = useNavigate();
//   const seatPrice = 3;
//   const totalSeats = 48; // 6 rows * 8 seats per row
//   const [selectedSeats, setSelectedSeats] = useState([]);
//   const [totalCost, setTotalCost] = useState(0);
//   const [showParkingPrompt, setShowParkingPrompt] = useState(false);
//   const [wantsParking, setWantsParking] = useState(null);
//   const [parkingType, setParkingType] = useState("");
//   const [phone, setPhone] = useState("");
//   const [vehicleNumber, setVehicleNumber] = useState("");
//   const [errors, setErrors] = useState({});
//   const seatStatuses = Array(totalSeats).fill(true);
//   const rowLabels = ['A', 'B', 'C', 'D', 'E', 'F'];

//   useEffect(() => {
//     setTotalCost(selectedSeats.length * seatPrice);
//   }, [selectedSeats]);

//   const handleSeatSelection = (index) => {
//     if (seatStatuses[index]) {
//       setSelectedSeats((prev) =>
//         prev.includes(index) ? prev.filter((seat) => seat !== index) : [...prev, index]
//       );
//     }
//   };

//   const handleProceedToPayment = () => {
//     if (selectedSeats.length > 0) {
//       setShowParkingPrompt(true);
//     }
//   };

//   const handleConfirmPayment = async () => {
//     const actualSeats = selectedSeats.map(index => {
//       const row = rowLabels[Math.floor(index / 8)];
//       const seatNumber = (index % 8) + 1;
//       return `${row}${seatNumber}`;
//     });
  
//     const bookingData = {
//       movie,
//       screen,
//       timing,
//       seats: actualSeats,
//       totalCost,
//       parkingDetails: wantsParking === "yes" ? {
//         parkingType,
//         phone,
//         vehicleNumber,
//       } : null,
//     };
  
//     try {
//       const response = await fetch('/api/checking', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(bookingData),
//       });
  
//       if (!response.ok) {
//         const errorData = await response.json();
//         console.error('Error response from server:', errorData);
//         setErrors({ ...errors, server: errorData.message });
//         return;
//       }
  
//       const data = await response.json();
//       console.log('Booking successful:', data);
//       navigate(wantsParking === "yes" ? '/parkLot' : '/payment');
      
//     } catch (error) {
//       console.error('Network error:', error);
//       setErrors({ ...errors, network: 'Network error: Failed to connect to server.' });
//     }
//   };
  

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-800 to-purple-800 text-white p-4 lg:p-8">
//       <h1 className="text-3xl font-bold text-center text-yellow-500 mb-6">
//         {movie} - Screen {screen} - {timing}
//       </h1>
//       <div className="flex justify-center items-center mb-8">
//         <div className="relative w-full">
//           <div className="absolute w-full h-2 bg-black rounded-full top-1/2 transform -translate-y-1/2 shadow-lg" />
//           <div className="absolute w-full h-2 bg-gray-900 rounded-full top-1/2 transform -translate-y-1/2 opacity-50" />
//         </div>
//       </div>

//       <div className="grid grid-cols-8 gap-3 mx-auto max-w-2xl">
//         {seatStatuses.map((isAvailable, index) => {
//           const row = rowLabels[Math.floor(index / 8)];
//           const seatNumber = (index % 8) + 1;

//           return (
//             <div
//               key={index}
//               className={`cursor-pointer flex items-center justify-center p-4 rounded-lg 
//                 ${selectedSeats.includes(index) ? 'bg-green-500 text-white' : 
//                   isAvailable ? 'bg-gray-600 text-gray-200 hover:bg-gray-500' : 
//                   'bg-red-600 text-gray-300 cursor-not-allowed'}
//                 transition duration-300 transform hover:scale-105`}
//               style={{ width: '50px', height: '50px' }}
//               onClick={() => handleSeatSelection(index)}
//             >
//               <span className="block text-sm font-semibold">
//                 {row}{seatNumber}
//               </span>
//             </div>
//           );
//         })}
//       </div>

//       <div className="mt-8 text-center">
//         <p className="text-xl font-semibold">
//           Total Cost: <FontAwesomeIcon icon={faDollarSign} /> {totalCost}
//         </p>
//         {selectedSeats.length > 0 && (
//           <button
//             className="mt-4 bg-gradient-to-r from-pink-500 to-orange-500 py-2 px-6 rounded-lg font-bold transition duration-300 transform hover:bg-pink-400 hover:scale-105 shadow-lg hover:shadow-xl"
//             onClick={handleProceedToPayment}
//           >
//             Proceed to Payment
//           </button>
//         )}
//       </div>

//       {showParkingPrompt && (
//         <div className="fixed inset-0 bg-gray-800 bg-opacity-80 flex items-center justify-center">
//           <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-lg text-white max-w-lg w-full relative">
//             <button
//               className="absolute top-4 right-4 text-gray-400 hover:text-gray-100"
//               onClick={() => setShowParkingPrompt(false)}
//             >
//               <FontAwesomeIcon icon={faTimes} />
//             </button>
//             <h2 className="text-2xl font-semibold mb-4 text-center">Parking Assistance</h2>
//             <p className="text-lg font-semibold mb-4">Do you want any help with parking your vehicle?</p>
//             <div className="flex justify-center mb-6">
//               <button
//                 className="px-4 py-2 m-2 rounded text-white bg-green-500"
//                 onClick={() => setWantsParking("yes")}
//               >
//                 Yes
//               </button>
//               <button
//                 className="px-4 py-2 m-2 rounded text-white bg-red-500"
//                 onClick={() => setWantsParking("no")}
//               >
//                 No
//               </button>
//             </div>
//             {wantsParking === "yes" && (
//               <div>
//                 <input
//                   className="block w-full p-2 mb-2 rounded border border-gray-600"
//                   type="text"
//                   placeholder="Parking Type"
//                   value={parkingType}
//                   onChange={(e) => setParkingType(e.target.value)}
//                 />
//                 <input
//                   className="block w-full p-2 mb-2 rounded border border-gray-600"
//                   type="text"
//                   placeholder="Phone Number"
//                   value={phone}
//                   onChange={(e) => setPhone(e.target.value)}
//                 />
//                 <input
//                   className="block w-full p-2 mb-2 rounded border border-gray-600"
//                   type="text"
//                   placeholder="Vehicle Number"
//                   value={vehicleNumber}
//                   onChange={(e) => setVehicleNumber(e.target.value)}
//                 />
//               </div>
//             )}
//             <button
//               className="mt-4 w-full bg-blue-500 py-2 rounded-lg font-semibold hover:bg-blue-400 transition duration-300"
//               onClick={handleConfirmPayment}
//             >
//               Confirm Payment
//             </button>
//             {errors.network && <p className="text-red-500 mt-2">{errors.network}</p>}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Tickets;




import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChair, faDollarSign, faFilm, faTimes, faCar, faPhone, faIdCard } from '@fortawesome/free-solid-svg-icons';

const Tickets = () => {
  const { movie, screen, timing } = useParams();
  const navigate = useNavigate();
  const seatPrice = 3;
  const totalSeats = 48; // 6 rows * 8 seats per row
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [showParkingPrompt, setShowParkingPrompt] = useState(false);
  const [wantsParking, setWantsParking] = useState(null);
  const [parkingType, setParkingType] = useState("");
  const [phone, setPhone] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [errors, setErrors] = useState({});
  const seatStatuses = Array(totalSeats).fill(true);
  const rowLabels = ['A', 'B', 'C', 'D', 'E', 'F'];

  useEffect(() => {
    setTotalCost(selectedSeats.length * seatPrice);
  }, [selectedSeats]);

  const handleSeatSelection = (index) => {
    if (seatStatuses[index]) {
      setSelectedSeats((prev) =>
        prev.includes(index) ? prev.filter((seat) => seat !== index) : [...prev, index]
      );
    }
  };

  const handleProceedToPayment = () => {
    if (selectedSeats.length > 0) {
      setShowParkingPrompt(true);
    }
  };

  const handleConfirmPayment = async () => {
    // Validating parking details when parking is selected
    if (wantsParking === "yes" && (!parkingType || !phone || !vehicleNumber)) {
      setErrors({ ...errors, parking: "All parking details are mandatory." });
      return;
    }

    const actualSeats = selectedSeats.map(index => {
      const row = rowLabels[Math.floor(index / 8)];
      const seatNumber = (index % 8) + 1;
      return `${row}${seatNumber}`;
    });

    const bookingData = {
      movie,
      screen,
      timing,
      seats: actualSeats,
      totalCost,
      parkingDetails: wantsParking === "yes" ? {
        parkingType,
        phone,
        vehicleNumber,
      } : null,
    };

    try {
      const response = await fetch('/api/checking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrors({ ...errors, server: errorData.message });
        return;
      }

      navigate(wantsParking === "yes" ? '/parkLot' : '/payment');
    } catch (error) {
      setErrors({ ...errors, network: 'Network error: Failed to connect to server.' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-purple-800 text-white p-4 lg:p-8">
      <h1 className="text-3xl font-bold text-center text-yellow-500 mb-6">
        {movie} - Screen {screen} - {timing}
      </h1>

      {/* Seat Selection */}
      <div className="grid grid-cols-8 gap-3 mx-auto max-w-2xl">
        {seatStatuses.map((isAvailable, index) => {
          const row = rowLabels[Math.floor(index / 8)];
          const seatNumber = (index % 8) + 1;
          return (
            <div
              key={index}
              className={`cursor-pointer flex items-center justify-center p-4 rounded-lg 
                ${selectedSeats.includes(index) ? 'bg-green-500 text-white' : 
                  isAvailable ? 'bg-gray-600 text-gray-200 hover:bg-gray-500' : 
                  'bg-red-600 text-gray-300 cursor-not-allowed'}
                transition duration-300 transform hover:scale-105`}
              style={{ width: '50px', height: '50px' }}
              onClick={() => handleSeatSelection(index)}
            >
              <span className="block text-sm font-semibold">{row}{seatNumber}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-8 text-center">
        <p className="text-xl font-semibold">
          Total Cost: <FontAwesomeIcon icon={faDollarSign} /> {totalCost}
        </p>
        {selectedSeats.length > 0 && (
          <button
            className="mt-4 bg-gradient-to-r from-pink-500 to-orange-500 py-2 px-6 rounded-lg font-bold transition duration-300 transform hover:bg-pink-400 hover:scale-105 shadow-lg hover:shadow-xl"
            onClick={handleProceedToPayment}
          >
            Proceed to Payment
          </button>
        )}
      </div>

      {/* Parking Assistance Prompt */}
      {showParkingPrompt && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-80 flex items-center justify-center">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-lg text-white max-w-lg w-full relative transition-transform transform hover:scale-105">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-100"
              onClick={() => setShowParkingPrompt(false)}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <h2 className="text-2xl font-semibold mb-4 text-center">Parking Assistance</h2>
            <p className="text-lg font-semibold mb-4">Do you need parking assistance?</p>
            <div className="flex justify-center mb-6">
              <button
                className="px-4 py-2 m-2 rounded text-white bg-green-500 hover:bg-green-600 transition duration-300"
                onClick={() => setWantsParking("yes")}
              >
                Yes
              </button>
              <button
                className="px-4 py-2 m-2 rounded text-white bg-red-500 hover:bg-red-600 transition duration-300"
                onClick={() => setWantsParking("no")}
              >
                No
              </button>
            </div>
            {wantsParking === "yes" && (
              <div>
                <div className="flex items-center mb-2">
                  <FontAwesomeIcon icon={faCar} className="mr-2 text-yellow-400" />
                  <select
                    className="block w-full p-2 rounded border border-gray-600 bg-gray-800 text-white"
                    value={parkingType}
                    onChange={(e) => setParkingType(e.target.value)}
                  >
                    <option value="" disabled>Select Parking Type</option>
                    <option value="Two Wheeler">Two Wheeler</option>
                    <option value="Four Wheeler">Four Wheeler</option>
                  </select>
                </div>
                <div className="flex items-center mb-2">
                  <FontAwesomeIcon icon={faPhone} className="mr-2 text-yellow-400" />
                  <input
                    className="block w-full p-2 rounded border border-gray-600 bg-gray-800 text-white"
                    type="text"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="flex items-center mb-2">
                  <FontAwesomeIcon icon={faIdCard} className="mr-2 text-yellow-400" />
                  <input
                    className="block w-full p-2 rounded border border-gray-600 bg-gray-800 text-white"
                    type="text"
                    placeholder="Vehicle Number"
                    value={vehicleNumber}
                    onChange={(e) => setVehicleNumber(e.target.value)}
                  />
                </div>
                {errors.parking && <p className="text-red-500 mt-2">{errors.parking}</p>}
              </div>
            )}
            <button
              className="mt-4 w-full bg-blue-500 py-2 rounded-lg font-semibold hover:bg-blue-400 transition duration-300"
              onClick={handleConfirmPayment}
            >
              Confirm Payment
            </button>
            {errors.network && <p className="text-red-500 mt-2">{errors.network}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Tickets;
