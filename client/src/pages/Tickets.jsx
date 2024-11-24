








import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign, faCar, faMotorcycle } from '@fortawesome/free-solid-svg-icons';

const Tickets = () => {
  const { movie, screen, timing } = useParams();
  const navigate = useNavigate();
  const seatPrice = 3;
  const twoWheelerPrice = 20;
  const fourWheelerPrice = 30;
  const totalSeats = 48;
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
  const { currentUser } = useSelector((state) => state.user);
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
      html: `
        <p>Movie: ${movie}</p>
        <p>Screen: ${screen}</p>
        <p>Timing: ${timing}</p>
        <p>Seats: ${actualSeats.join(', ')}</p>
        <p>Total Seat Cost: $${selectedSeats.length * seatPrice}</p>
      `,
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
      html: `
        <p>Movie: ${movie}</p>
        <p>Screen: ${screen}</p>
        <p>Timing: ${timing}</p>
        <p>Seats: ${actualSeats.join(', ')}</p>
        <p>Total Seat Cost: $${selectedSeats.length * seatPrice}</p>
        ${parkingDetails ? `<p>Parking Cost: $${parkingCost}</p>` : ''}
        <p>Total Cost: $${totalCost}</p>
      `,
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
        currentUser,
      };

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

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;
    if (value.length <= 10) {
      setPhone(value);
    }
    if (!/^\d{10}$/.test(value) && value.length === 10) {
      Swal.fire('Error', 'Please enter a valid 10-digit phone number.', 'error');
    }
  };

  const handleVehicleNumberChange = (e, type, index) => {
    const newVehicleNumbers = { ...vehicleNumbers };
    newVehicleNumbers[type][index] = e.target.value;
    setVehicleNumbers(newVehicleNumbers);
  };

  const handleConfirmParking = () => {
    if (!phone) {
      Swal.fire('Error', 'Please enter your phone number.', 'error');
      return;
    }

    if (selectedTwoWheelerSlots.length > 0 && selectedTwoWheelerSlots.some((_, index) => !vehicleNumbers.twoWheeler[index])) {
      Swal.fire('Error', 'Please enter vehicle numbers for all selected two-wheeler parking slots.', 'error');
      return;
    }

    if (selectedFourWheelerSlots.length > 0 && selectedFourWheelerSlots.some((_, index) => !vehicleNumbers.fourWheeler[index])) {
      Swal.fire('Error', 'Please enter vehicle numbers for all selected four-wheeler parking slots.', 'error');
      return;
    }

    handleFinalConfirmation();
  };

  return (
      
    <div className="min-h-screen bg-gradient-to-br from-gray-800 text-white p-4 lg:p-8">
      <h1 className="text-3xl font-bold text-center text-yellow-500 mb-6">
        {movie} - Screen {screen} - {timing}
      </h1>
{/* Display logged-in user's email */}
{currentUser && (
        <div className="text-center text-lg mb-6 text-green-400">
          <p>Welcome, {currentUser.email}</p>
        </div>
      )}
      
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

      <div className="my-6 flex flex-col items-center">
        <p className="text-lg font-semibold">
          Total Cost: <span className="text-yellow-400">${totalCost}</span>
        </p>
        <button
          onClick={handleConfirm}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg mt-4"
        >
          Proceed to Book
        </button>
      </div>

      {showParkingPrompt && (
        <div className="my-6">
          <h2 className="text-2xl font-bold text-center mb-4">Parking Assistance</h2>
          <div className="flex justify-center mb-4">
            <input
              type="number"
              placeholder="Enter Phone Number"
              className="p-2 rounded-md bg-gray-200 text-gray-800"
              onChange={handlePhoneNumberChange}
              value={phone}
            />
          </div>
          <div className="flex justify-center space-x-6 my-4">
            <div>
              <h3 className="text-lg font-semibold text-center">Two-Wheeler Slots</h3>
              <div className="flex flex-wrap justify-center gap-2">
                {twoWheelerSlots.map((slot) => (
                  <div
                    key={slot}
                    className={`cursor-pointer p-2 rounded-md
                      ${selectedTwoWheelerSlots.includes(slot) ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                    onClick={() => handleSlotSelection(slot, 'Two-Wheeler')}
                  >
                    {slot}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-center">Four-Wheeler Slots</h3>
              <div className="flex flex-wrap justify-center gap-2">
                {fourWheelerSlots.map((slot) => (
                  <div
                    key={slot}
                    className={`cursor-pointer p-2 rounded-md
                      ${selectedFourWheelerSlots.includes(slot) ? 'bg-purple-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                    onClick={() => handleSlotSelection(slot, 'Four-Wheeler')}
                  >
                    {slot}
                  </div>
                ))}
              </div>
            </div>
          </div>
          {selectedTwoWheelerSlots.length > 0 && (
            <div className="my-4">
              <h3 className="text-lg font-semibold text-center">Vehicle Numbers for Two-Wheeler Slots</h3>
              <div className="flex justify-center space-x-4">
                {selectedTwoWheelerSlots.map((_, index) => (
                  <input
                    key={index}
                    type="text"
                    placeholder="Enter Vehicle Number"
                    className="p-2 rounded-md bg-gray-200 text-gray-800"
                    onChange={(e) => handleVehicleNumberChange(e, 'twoWheeler', index)}
                    value={vehicleNumbers.twoWheeler[index] || ''}
                  />
                ))}
              </div>
            </div>
          )}
          {selectedFourWheelerSlots.length > 0 && (
            <div className="my-4">
              <h3 className="text-lg font-semibold text-center">Vehicle Numbers for Four-Wheeler Slots</h3>
              <div className="flex justify-center space-x-4">
                {selectedFourWheelerSlots.map((_, index) => (
                  <input
                    key={index}
                    type="text"
                    placeholder="Enter Vehicle Number"
                    className="p-2 rounded-md bg-gray-200 text-gray-800"
                    onChange={(e) => handleVehicleNumberChange(e, 'fourWheeler', index)}
                    value={vehicleNumbers.fourWheeler[index] || ''}
                  />
                ))}
              </div>
            </div>
          )}
          <div className="flex justify-center">
            <button
              onClick={handleConfirmParking}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-6 rounded-lg mt-4"
            >
              Confirm Parking
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tickets;
