
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign, faTimes, faCar, faPhone, faIdCard } from '@fortawesome/free-solid-svg-icons';

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
  const seatStatuses = Array(totalSeats).fill(true); // Assuming all seats are available initially
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
    // Validate parking information if the user wants parking
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
      email: localStorage.getItem('userEmail'),  // Assuming email is stored in localStorage
      parkingDetails: wantsParking === "yes" ? {
        parkingType,
        phone,
        vehicleNumber,
      } : null,
    };

    try {
      const token = localStorage.getItem('jwtToken'); // Get the actual token
      if (!token) {
        setErrors({ ...errors, token: 'Token not found. Please log in again.' });
        return;
      }

      const response = await fetch('/api/checking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Correct token header
        },
        body: JSON.stringify(bookingData),
        credentials: 'include', 
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrors({ ...errors, server: errorData.message });
        return;
      }

      // Redirect to either parkLot or payment page depending on parking choice
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
            <h2 className="text-xl mb-4">Parking Assistance</h2>
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-sm">Do you want parking?</label>
                <div className="flex items-center gap-4">
                  <button
                    className="bg-green-500 py-2 px-4 rounded-lg"
                    onClick={() => setWantsParking("yes")}
                  >
                    Yes
                  </button>
                  <button
                    className="bg-red-500 py-2 px-4 rounded-lg"
                    onClick={() => setWantsParking("no")}
                  >
                    No
                  </button>
                </div>
              </div>

              {wantsParking === "yes" && (
                <>
                  <div>
                    <label className="block mb-2 text-sm">Parking Type</label>
                    <select
                      value={parkingType}
                      onChange={(e) => setParkingType(e.target.value)}
                      className="w-full p-2 bg-gray-700 text-white rounded-lg"
                    >
                      <option value="">Select Type</option>
                      <option value="Two Wheeler">Two Wheeler</option>
                      <option value="Four Wheeler">Four Wheeler</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm">Phone Number</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full p-2 bg-gray-700 text-white rounded-lg"
                      placeholder="Phone Number"
                      maxLength={10}
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm">Vehicle Number</label>
                    <input
                      type="text"
                      value={vehicleNumber}
                      onChange={(e) => setVehicleNumber(e.target.value)}
                      className="w-full p-2 bg-gray-700 text-white rounded-lg"
                      placeholder="Vehicle Number"
                    />
                  </div>
                </>
              )}
            </div>

            <button
              onClick={handleConfirmPayment}
              className="mt-4 bg-gradient-to-r from-blue-500 to-blue-400 text-white py-2 px-6 rounded-lg font-bold transition duration-300 transform hover:bg-blue-300"
            >
              Confirm Booking
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tickets;
