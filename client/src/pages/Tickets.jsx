
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
      title: '<span class="text-3xl font-bold text-yellow-400">🎥 Confirm Movie Booking</span>',
      html: `
        <div class="text-gray-200 text-lg">
          <p><span class="font-semibold">Movie:</span> ${movie}</p>
          <p><span class="font-semibold">Screen:</span> ${screen}</p>
          <p><span class="font-semibold">Timing:</span> ${timing}</p>
          <p><span class="font-semibold">Seats:</span> ${actualSeats.join(', ')}</p>
          <p class="mt-2"><span class="font-semibold">Total Seat Cost:</span> $${selectedSeats.reduce((acc, seatIndex) => {
            const category = Object.keys(seatCategories).find((cat) => seatCategories[cat].includes(seatIndex));
            return acc + (seatPrice[category] || 0);
          }, 0)}</p>
        </div>
      `,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: '<span class="px-4 py-2 rounded-full">Next</span>',
      cancelButtonText: '<span class="px-4 py-2 rounded-full">Cancel</span>',
      confirmButtonColor: '#10B981', // Tailwind's emerald-500
      cancelButtonColor: '#EF4444', // Tailwind's red-500
      customClass: {
        popup: 'bg-gradient-to-r from-blue-700 to-purple-800 p-8 rounded-lg shadow-xl',
        title: 'text-center font-bold text-yellow-400',
        htmlContainer: 'text-left text-gray-200',
        confirmButton: 'bg-emerald-500 text-white px-6 py-2 rounded-full hover:bg-emerald-600 transition-all',
        cancelButton: 'bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 transition-all',
      },
      background: 'rgba(25, 25, 25, 0.9)', // Dark background for better focus
    });
    
    if (!movieConfirmation.isConfirmed) return;
    const parkingResult = await Swal.fire({
      title: '<span class="text-3xl font-bold text-yellow-400">🚗 Ready for a luxury parking experience?</span>',
      html: `
        <p class="text-lg text-gray-100 mb-4">We’re here to help you find the best parking spot for your vehicle! 🚙</p>
        <div class="flex justify-center space-x-4">
       
          <span class="text-xl text-gray-200">Let us guide you!</span>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Show Me Parking 🅿️',
      cancelButtonText: 'No, Thanks 🙅‍♂️',
      confirmButtonColor: '#10B981', // Tailwind's emerald-500
      cancelButtonColor: '#EF4444', // Tailwind's red-500
      customClass: {
        popup: 'bg-gradient-to-r from-blue-700 to-purple-800 p-8 rounded-lg shadow-xl',
        title: 'text-center font-bold text-yellow-400',
        htmlContainer: 'text-center text-gray-200',
        confirmButton: 'px-6 py-2 text-white font-semibold rounded-full hover:bg-emerald-600 transition-all',
        cancelButton: 'px-6 py-2 text-white font-semibold rounded-full hover:bg-red-600 transition-all',
      },
      background: 'rgba(25, 25, 25, 0.9)', // Darker background for contrast
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
          parkingType: parkingNeeded ? (selectedTwoWheelerSlots.length ? "Two-Wheeler" : "Four-Wheeler") : "N/A",
          selectedSlot: {
            twoWheeler: selectedTwoWheelerSlots.join(", "),
            fourWheeler: selectedFourWheelerSlots.join(", "),
          }
          
        }
      : null;

      const result = await Swal.fire({
        title: '<span class="text-3xl font-bold text-yellow-400">🎥 Confirm Your Booking</span>',
        html: `
          <div class="text-gray-200 text-lg">
            <p><span class="font-semibold">Movie:</span> ${movie}</p>
            <p><span class="font-semibold">Screen:</span> ${screen}</p>
            <p><span class="font-semibold">Timing:</span> ${timing}</p>
            <p><span class="font-semibold">Seats:</span> ${actualSeats.join(', ')}</p>
            <p><span class="font-semibold">Total Seat Cost:</span> $${selectedSeats.reduce((acc, seatIndex) => {
              const category = Object.keys(seatCategories).find((cat) => seatCategories[cat].includes(seatIndex));
              return acc + (seatPrice[category] || 0);
            }, 0)}</p>
            ${parkingDetails ? `<p><span class="font-semibold">Parking Cost:</span> $${parkingCost}</p>` : ''}
            <p class="mt-4 text-xl font-bold"><span class="text-yellow-400">Total Cost:</span> $${totalCost}</p>
          </div>
        `,
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: '<span class="px-4 py-2 rounded-full">Proceed to Payment</span>',
        cancelButtonText: '<span class="px-4 py-2 rounded-full">Cancel</span>',
        confirmButtonColor: '#10B981', // Tailwind's emerald-500
        cancelButtonColor: '#EF4444', // Tailwind's red-500
        customClass: {
          popup: 'bg-gradient-to-r from-blue-700 to-purple-800 p-8 rounded-lg shadow-xl',
          title: 'text-center font-bold text-yellow-400',
          htmlContainer: 'text-left text-gray-200',
          confirmButton: 'bg-emerald-500 text-white px-6 py-2 rounded-full hover:bg-emerald-600 transition-all',
          cancelButton: 'bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 transition-all',
        },
        background: 'rgba(25, 25, 25, 0.9)', // Dark background for better contrast
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
          className={`seat w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 flex justify-center items-center rounded text-white cursor-pointer transition-all duration-300 ease-in-out transform ${
            isSelected
              ? 'bg-green-500 scale-105 shadow-lg'
              : 'bg-gray-600 hover:bg-gray-500 hover:scale-110'
          } ${
            category === 'Gold'
              ? 'border-2 border-yellow-400'
              : category === 'Platinum'
              ? 'border-2 border-blue-400'
              : category === 'Silver'
              ? 'border-2 border-gray-400'
              : category === 'Diamond'
              ? 'border-2 border-indigo-400'
              : 'border-2 border-red-400'
          }`}
          onClick={() => handleSeatSelection(index)}
          title={`Row: ${row}, Seat: ${seatNumber}`}
        >
          {`${row}${seatNumber}`}
        </div>
      );
    })}
  </div>



      {/* Parking Assistance Section */}
      {showParkingPrompt && (
  <div className="parking-section w-full md:w-3/4 lg:w-1/2 mt-8 p-6 border rounded shadow-md bg-gray-100 transform transition-transform duration-500 ease-in-out hover:scale-105">
    <h2 className="text-xl font-bold mb-4 text-center text-yellow-600">
      Parking Assistance
    </h2>
    <div className="mb-4">
      <label className="block font-semibold mb-2 text-gray-700">
        Phone Number
        <input
          type="tel"
          value={phone}
          onChange={handlePhoneNumberChange}
          className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-yellow-300 transition-all duration-300 ease-in-out transform hover:scale-105"
          placeholder="Enter 10-digit phone number"
        />
      </label>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Two-Wheeler Slots</h3>
        <div className="grid grid-cols-5 gap-2">
          {twoWheelerSlots.map((slot, index) => (
            <div
              key={slot}
              className={`slot p-2 text-center cursor-pointer border rounded transition-all duration-300 ease-in-out transform hover:scale-110 ${
                selectedTwoWheelerSlots.includes(slot) ? 'bg-green-500 text-white' : 'bg-gray-300 hover:bg-gray-400'
              }`}
              onClick={() => handleSlotSelection(slot, 'Two-Wheeler')}
            >
              {slot}
            </div>
          ))}
        </div>
        {selectedTwoWheelerSlots.map((slot, index) => (
          <div key={slot} className="mt-2">
            <label className="block font-semibold text-gray-700">
              Vehicle Number for {slot}
              <input
                type="text"
                value={vehicleNumbers.twoWheeler[index] || ''}
                onChange={(e) => handleVehicleNumberChange(e, 'twoWheeler', index)}
                className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-yellow-300 transition-all duration-300 ease-in-out transform hover:scale-105"
                placeholder="Enter vehicle number"
              />
            </label>
          </div>
        ))}
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Four-Wheeler Slots</h3>
        <div className="grid grid-cols-5 gap-2">
          {fourWheelerSlots.map((slot, index) => (
            <div
              key={slot}
              className={`slot p-2 text-center cursor-pointer border rounded transition-all duration-300 ease-in-out transform hover:scale-110 ${
                selectedFourWheelerSlots.includes(slot) ? 'bg-green-500 text-white' : 'bg-gray-300 hover:bg-gray-400'
              }`}
              onClick={() => handleSlotSelection(slot, 'Four-Wheeler')}
            >
              {slot}
            </div>
          ))}
        </div>
        {selectedFourWheelerSlots.map((slot, index) => (
          <div key={slot} className="mt-2">
            <label className="block font-semibold text-gray-700">
              Vehicle Number for {slot}
              <input
                type="text"
                value={vehicleNumbers.fourWheeler[index] || ''}
                onChange={(e) => handleVehicleNumberChange(e, 'fourWheeler', index)}
                className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-yellow-300 transition-all duration-300 ease-in-out transform hover:scale-105"
                placeholder="Enter vehicle number"
              />
            </label>
          </div>
        ))}
      </div>
    </div>

    <div className="mt-6 flex justify-end">
      <button
        onClick={handleConfirmParking}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-semibold transition-all duration-300 ease-in-out transform hover:scale-110"
      >
        Confirm Parking
      </button>
    </div>
  </div>
)}

{/* Confirm Booking Button */}
<div className="mt-8">
  <button
    onClick={handleConfirm}
    className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg text-lg font-bold shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-110"
  >
    Confirm Booking
  </button>
</div>

    </div>
  );
};

export default Tickets;
