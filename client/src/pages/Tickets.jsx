import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign, faTimes } from '@fortawesome/free-solid-svg-icons';

const Tickets = () => {
  const { movie, screen, timing } = useParams();
  const navigate = useNavigate();
  const seatPrice = 3;
  const totalSeats = 84; // 6 rows * 8 seats per row
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
// Inside Tickets.jsx, checking for movie data and adding seat validation:
useEffect(() => {
  if (!movie || !screen || !timing) {
      navigate("/error");  // Redirect to an error page if movie data is missing
  }
}, [movie, screen, timing]);

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
    if (wantsParking === "yes" && (!parkingType || !phone || !vehicleNumber)) {
      setErrors({ ...errors, parking: "All parking details are mandatory." });
      return;
    }
  
    // Generate actual seat labels from selectedSeats
    const actualSeats = selectedSeats.map(index => {
      const row = rowLabels[Math.floor(index / 8)];
      const seatNumber = (index % 8) + 1;
      return `${row}${seatNumber}`;
    });
  
    // Construct booking data
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
      // Send POST request to the server
      const response = await fetch('/api/booking/test-booking', {
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
  
      console.log('Redirecting now...');
      navigate(wantsParking === "yes" ? '/parkLot' : '/payment');
    } catch (error) {
      console.error('Error during booking:', error);
      setErrors({ ...errors, network: 'Network error: Failed to connect to server.' });
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 text-white p-4 lg:p-8">
      <h1 className="text-3xl font-bold text-center text-yellow-500 mb-6">
        {movie} - Screen {screen} - {timing}
      </h1>

      {/* Movie Screen Visualization */}
      <div className="flex justify-center mb-4">
        <div className="bg-gray-800 text-white w-full text-center p-2 rounded-lg shadow-lg font-semibold">
          <p className="text-xl">Movie Screen</p>
        </div>
      </div>

      {/* Responsive Seat Grid */}
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
                  'bg-red-600 text-gray-300 cursor-not-allowed'}
                transition-transform duration-300 ease-in-out transform hover:scale-110 hover:rotate-3`}
              style={{ width: '45px', height: '45px' }}
              onClick={() => handleSeatSelection(index)}
            >
              <span className="text-sm font-semibold">{row}{seatNumber}</span>
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

      {showParkingPrompt && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-80 flex items-center justify-center p-4 sm:p-8 animate__animated animate__fadeIn">
          <div className="bg-white text-black rounded-lg shadow-xl p-6 max-w-lg w-full animate__animated animate__zoomIn">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-semibold">Parking Details</h3>
              <FontAwesomeIcon
                icon={faTimes}
                className="cursor-pointer text-2xl"
                onClick={() => setShowParkingPrompt(false)}
              />
            </div>

            <div className="mt-4">
              <label className="block text-lg">Do you want parking?</label>
              <div className="flex items-center mt-2">
                <label className="mr-4">
                  <input
                    type="radio"
                    name="parking"
                    value="yes"
                    onChange={() => setWantsParking("yes")}
                  />{" "}
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="parking"
                    value="no"
                    onChange={() => setWantsParking("no")}
                    defaultChecked
                  />{" "}
                  No
                </label>
              </div>
            </div>

            {wantsParking === "yes" && (
              <div className="mt-4">
                <label className="block text-lg">Parking Type</label>
                <select
                  className="w-full mt-2 p-2 border border-gray-300 rounded-md"
                  value={parkingType}
                  onChange={(e) => setParkingType(e.target.value)}
                >
                  <option value="">Select Parking Type</option>
                  <option value="Two-Wheeler">Two-Wheeler</option>
                  <option value="Four-Wheeler">Four-Wheeler</option>
                </select>
                <div className="mt-4">
                  <label className="block text-lg">Phone Number</label>
                  <input
                    type="text"
                    className="w-full mt-2 p-2 border border-gray-300 rounded-md"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    maxLength="10"
                    placeholder="Enter your 10-digit phone number"
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-lg">Vehicle Number</label>
                  <input
                    type="text"
                    className="w-full mt-2 p-2 border border-gray-300 rounded-md"
                    value={vehicleNumber}
                    onChange={(e) => setVehicleNumber(e.target.value)}
                    placeholder="Enter your vehicle number"
                  />
                </div>

                {errors.parking && (
                  <p className="text-red-500 text-sm mt-2">{errors.parking}</p>
                )}
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                className="bg-blue-500 text-white py-2 px-6 rounded-md font-semibold"
                onClick={handleConfirmPayment}
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tickets;
