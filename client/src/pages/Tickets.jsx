
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign, faCar, faMotorcycle } from '@fortawesome/free-solid-svg-icons';

const Tickets = () => {
  const { movie, screen, timing } = useParams();
  const navigate = useNavigate();
  const seatPrice = {
    Gold: 6,
    Platinum: 8,
    Silver: 3,
    Diamond: 10,
    Balcony: 5,
  };
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
  const seatCategories = {
    Gold: [0, 1, 2, 3, 4, 5],
    Platinum: [6, 7, 8, 9, 10, 11],
    Silver: [12, 13, 14, 15, 16, 17],
    Diamond: [18, 19, 20, 21, 22, 23],
    Balcony: [24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47],
  };
  const rowLabels = ['A', 'B', 'C', 'D', 'E', 'F'];
  const twoWheelerSlots = [
    "T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10",
    "T11", "T12", "T13", "T14", "T15", "T16", "T17", "T18", "T19", "T20",
    "T21", "T22", "T23", "T24", "T25", "T26", "T27", "T28", "T29", "T30",
    "T31", "T32", "T33", "T34", "T35", "T36", "T37", "T38", "T39", "T40"
  ];
  
  const fourWheelerSlots = [
    "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10",
    "F11", "F12", "F13", "F14", "F15", "F16", "F17", "F18", "F19", "F20",
    "F21", "F22", "F23", "F24", "F25", "F26", "F27", "F28", "F29", "F30",
    "F31", "F32", "F33", "F34", "F35", "F36", "F37", "F38", "F39", "F40"
  ];
  
  const { currentUser } = useSelector((state) => state.user);
  const parkingCost =
    selectedTwoWheelerSlots.length * twoWheelerPrice +
    selectedFourWheelerSlots.length * fourWheelerPrice;
   
  useEffect(() => {
    const seatCost = selectedSeats.reduce((acc, seatIndex) => {
      const category = Object.keys(seatCategories).find((cat) => seatCategories[cat].includes(seatIndex));
      return acc + (seatPrice[category] || 0);
    }, 0);
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
        <p>Total Seat Cost: $${selectedSeats.reduce((acc, seatIndex) => {
          const category = Object.keys(seatCategories).find((cat) => seatCategories[cat].includes(seatIndex));
          return acc + (seatPrice[category] || 0);
        }, 0)}</p>
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
        <p>Total Seat Cost: $${selectedSeats.reduce((acc, seatIndex) => {
          const category = Object.keys(seatCategories).find((cat) => seatCategories[cat].includes(seatIndex));
          return acc + (seatPrice[category] || 0);
        }, 0)}</p>
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
    <div className="flex flex-col items-center p-4">
      <div className="flex flex-col items-center p-4">
      {currentUser && (
        <div className="text-center text-lg mb-6 text-green-400">
          <p>Welcome, {currentUser.email}</p>
        </div>
      )}
      <h1 className="text-3xl font-bold text-center text-yellow-500 mb-6">
        {movie} - Screen {screen} - {timing}
      </h1>
        <h1 className="text-2xl md:text-4xl font-semibold mb-4">Select Your Seats</h1>
        <div className="grid grid-cols-8 gap-2 sm:gap-3 md:gap-4 lg:gap-6 p-4 border rounded shadow-md">
          {Array.from({ length: totalSeats }).map((_, index) => {
            const row = rowLabels[Math.floor(index / 8)];
            const seatNumber = (index % 8) + 1;
            const isSelected = selectedSeats.includes(index);
            const category = Object.keys(seatCategories).find((cat) => seatCategories[cat].includes(index));
            return (
              <div
                key={index}
                className={`seat w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 flex justify-center items-center rounded text-white cursor-pointer ${
                  isSelected ? 'bg-green-500' : 'bg-gray-600'
                } ${
                  category === 'Gold' ? 'border-yellow-400' :
                  category === 'Platinum' ? 'border-blue-400' :
                  category === 'Silver' ? 'border-gray-400' :
                  category === 'Diamond' ? 'border-indigo-400' :
                  'border-red-400'
                }`}
                onClick={() => handleSeatSelection(index)}
                title={`Row: ${row}, Seat: ${seatNumber}`}
              >
                {`${row}${seatNumber}`}
              </div>
            );
          })}
        </div>
      </div>






{showParkingPrompt && (
  <div className="flex flex-col items-center w-full md:w-3/4 p-4 border mt-6 rounded shadow-md">
    <h2 className="text-lg md:text-xl font-semibold mb-4">Parking Details</h2>
    <div className="flex flex-col md:flex-row justify-between w-full">
      
      {/* Two-Wheeler Slots */}
      <div className="flex flex-col items-center mb-6 md:mb-0 md:mr-4">
        <h3 className="text-md font-semibold mb-2">Two-Wheeler Slots</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
          {twoWheelerSlots.map((slot) => (
            <button
              key={slot}
              onClick={() => handleSlotSelection(slot, "Two-Wheeler")}
              className={`w-24 p-2 rounded ${
                selectedTwoWheelerSlots.includes(slot) ? 'bg-green-500' : 'bg-gray-300'
              } hover:bg-green-400 transition duration-300 ease-in-out`}
            >
              {slot}
            </button>
          ))}
        </div>
      </div>

      {/* Four-Wheeler Slots */}
      <div className="flex flex-col items-center mb-6 md:mb-0 md:mr-4">
        <h3 className="text-md font-semibold mb-2">Four-Wheeler Slots</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
          {fourWheelerSlots.map((slot) => (
            <button
              key={slot}
              onClick={() => handleSlotSelection(slot, "Four-Wheeler")}
              className={`w-24 p-2 rounded ${
                selectedFourWheelerSlots.includes(slot) ? 'bg-green-500' : 'bg-gray-300'
              } hover:bg-green-400 transition duration-300 ease-in-out`}
            >
              {slot}
            </button>
          ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center mt-6 w-full">
            <label htmlFor="phone" className="font-semibold mb-2">Phone Number:</label>
            <input
              type="text"
              id="phone"
              value={phone}
              onChange={handlePhoneNumberChange}
              className="p-2 border rounded-md w-full md:w-1/2 mb-4"
              placeholder="Enter 10-digit phone number"
            />
            {selectedTwoWheelerSlots.map((slot, index) => (
              <div key={slot} className="w-full md:w-1/2 flex flex-col mb-4">
                <label htmlFor={`twoWheeler-${index}`} className="font-semibold mb-1">
                  {`Vehicle Number for ${slot}:`}
                </label>
                <input
                  type="text"
                  id={`twoWheeler-${index}`}
                  value={vehicleNumbers.twoWheeler[index] || ""}
                  onChange={(e) => handleVehicleNumberChange(e, "twoWheeler", index)}
                  className="p-2 border rounded-md"
                  placeholder="Enter Vehicle Number"
                />
              </div>
            ))}
            {selectedFourWheelerSlots.map((slot, index) => (
              <div key={slot} className="w-full md:w-1/2 flex flex-col mb-4">
                <label htmlFor={`fourWheeler-${index}`} className="font-semibold mb-1">
                  {`Vehicle Number for ${slot}:`}
                </label>
                <input
                  type="text"
                  id={`fourWheeler-${index}`}
                  value={vehicleNumbers.fourWheeler[index] || ""}
                  onChange={(e) => handleVehicleNumberChange(e, "fourWheeler", index)}
                  className="p-2 border rounded-md"
                  placeholder="Enter Vehicle Number"
                />
              </div>
            ))}
          </div>
          <button
            onClick={handleConfirmParking}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mt-4"
          >
            Confirm Parking
          </button>
        </div>
      )}
      <button
        onClick={handleConfirm}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-6"
      >
        Proceed to Booking
      </button>




<div className="mt-6 p-4 border rounded shadow-md w-full md:w-1/2">
  <h3 className="text-xl font-semibold animate-fadeIn">Cost Breakdown</h3>
  <p className="animate-fadeIn">
    Total Seats Cost: <FontAwesomeIcon icon={faDollarSign} /> 
    {selectedSeats.reduce((acc, seatIndex) => {
      const category = Object.keys(seatCategories).find((cat) => seatCategories[cat].includes(seatIndex));
      return acc + (seatPrice[category] || 0);
    }, 0)}
  </p>
  <p className="animate-fadeIn">
    Total Parking Cost: <FontAwesomeIcon icon={faDollarSign} /> {parkingCost}
  </p>
  <p className="animate-fadeIn">
    Total Cost: <FontAwesomeIcon icon={faDollarSign} /> {totalCost}
  </p>
</div>

    </div>
  );
};

export default Tickets;
