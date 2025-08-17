
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
      title: `<span class="text-3xl font-cinzel font-bold text-[#C8A951]" style="text-shadow: 0 0 10px rgba(200, 169, 81, 0.3);">Confirm Movie Booking</span>`,
      html: `
        <div class="text-[#F5F5F5] text-lg font-poppins">
          <p class="mb-2"><span class="text-[#C8A951] font-medium">Movie:</span> ${movie}</p>
          <p class="mb-2"><span class="text-[#C8A951] font-medium">Screen:</span> ${screen}</p>
          <p class="mb-2"><span class="text-[#C8A951] font-medium">Timing:</span> ${timing}</p>
          <p class="mb-2"><span class="text-[#C8A951] font-medium">Seats:</span> ${actualSeats.join(', ')}</p>
          <p class="mt-4 pt-3 border-t border-[#C8A951]/30"><span class="text-[#C8A951] font-semibold">Total Seat Cost:</span> $${selectedSeats.reduce((acc, seatIndex) => {
            const category = Object.keys(seatCategories).find((cat) => seatCategories[cat].includes(seatIndex));
            return acc + (seatPrice[category] || 0);
          }, 0)}</p>
        </div>
      `,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: '<span class="px-6">Next</span>',
      cancelButtonText: '<span class="px-6">Cancel</span>',
      confirmButtonColor: '#0D0D0D',
      cancelButtonColor: '#0D0D0D',
      customClass: {
        popup: 'bg-[#0D0D0D] border border-[#C8A951]/30 p-8 shadow-2xl',
        title: 'text-center mb-4',
        htmlContainer: 'text-left',
        confirmButton: 'border border-[#C8A951] text-[#F5F5F5] hover:bg-[#C8A951]/10 transition-all font-cinzel',
        cancelButton: 'border border-[#E50914] text-[#F5F5F5] hover:bg-[#E50914]/10 transition-all font-cinzel',
        icon: 'text-[#C8A951]'
      },
      background: '#0D0D0D',
    });
    
    if (!movieConfirmation.isConfirmed) return;
    const parkingResult = await Swal.fire({
      title: '<span class="font-cinzel text-3xl font-bold text-[#C8A951] tracking-wide" style="text-shadow: 0 0 10px rgba(200, 169, 81, 0.3);">Valet Parking Service</span>',
      html: `
        <p class="text-lg text-gray-100 mb-4">We’re here to help you find the best parking spot for your vehicle! 🚙</p>
        <div class="flex justify-center space-x-4">
       
          <span class="text-xl text-gray-200">Let us guide you!</span>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Reserve Parking',
      cancelButtonText: 'No, Thank You',
      confirmButtonColor: '#0D0D0D',
      cancelButtonColor: '#1A1A1A',
      customClass: {
        popup: 'bg-[#0D0D0D] border border-[#C8A951]/30 rounded-none p-8',
        title: 'text-center font-cinzel mb-6',
        htmlContainer: 'text-center',
        confirmButton: 'px-8 py-3 text-[#C8A951] font-cinzel border border-[#C8A951] hover:bg-[#C8A951]/10 tracking-wider transition-all duration-300',
        cancelButton: 'px-8 py-3 text-[#F5F5F5] font-cinzel border border-[#E50914]/50 hover:bg-[#E50914]/10 tracking-wider transition-all duration-300',
        actions: 'mt-8'
      },
      background: '#0D0D0D',
      backdrop: `
        rgba(0,0,0,0.8)
        url("/cinipop.webp")
        left top
        no-repeat
      `
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
        title: `<span class="text-3xl font-cinzel font-bold text-[#C8A951]" style="text-shadow: 0 0 10px rgba(200, 169, 81, 0.3);">Confirm Your Booking</span>`,
        html: `
          <div class="text-[#F5F5F5] text-lg font-poppins">
            <p class="mb-2"><span class="text-[#C8A951] font-medium">Movie:</span> ${movie}</p>
            <p class="mb-2"><span class="text-[#C8A951] font-medium">Screen:</span> ${screen}</p>
            <p class="mb-2"><span class="text-[#C8A951] font-medium">Timing:</span> ${timing}</p>
            <p class="mb-2"><span class="text-[#C8A951] font-medium">Seats:</span> ${actualSeats.join(', ')}</p>
            <p class="mb-2"><span class="text-[#C8A951] font-medium">Seat Cost:</span> $${selectedSeats.reduce((acc, seatIndex) => {
              const category = Object.keys(seatCategories).find((cat) => seatCategories[cat].includes(seatIndex));
              return acc + (seatPrice[category] || 0);
            }, 0)}</p>
            ${parkingDetails ? `<p class="mb-2"><span class="text-[#C8A951] font-medium">Parking Cost:</span> $${parkingCost}</p>` : ''}
            <p class="mt-4 pt-3 border-t border-[#C8A951]/30 text-xl font-cinzel font-bold"><span class="text-[#C8A951]">Total Cost:</span> $${totalCost}</p>
          </div>
        `,
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: '<span class="px-6">Proceed to Payment</span>',
        cancelButtonText: '<span class="px-6">Cancel</span>',
        confirmButtonColor: '#0D0D0D',
        cancelButtonColor: '#0D0D0D',
        customClass: {
          popup: 'bg-[#0D0D0D] border border-[#C8A951]/30 p-8 shadow-2xl',
          title: 'text-center mb-4',
          htmlContainer: 'text-left',
          confirmButton: 'border border-[#C8A951] text-[#F5F5F5] hover:bg-[#C8A951]/10 transition-all font-cinzel',
          cancelButton: 'border border-[#E50914] text-[#F5F5F5] hover:bg-[#E50914]/10 transition-all font-cinzel',
          icon: 'text-[#C8A951]'
        },
        background: '#0D0D0D',
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
     const response = await fetch('https://cinematic-popcorn-theatre-experience-1.onrender.com/api/bookings', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include', // ✅ This line ensures cookies/auth is sent
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
      Swal.fire({
        title: '<span class="font-cinzel text-xl font-bold text-[#E50914]">Attention Required</span>',
        html: '<p class="font-poppins text-[#F5F5F5]">Please enter your phone number for parking reservation.</p>',
        icon: 'error',
        background: '#0D0D0D',
        confirmButtonColor: '#0D0D0D',
        confirmButtonText: 'Understood',
        customClass: {
          confirmButton: 'px-6 py-2 text-[#F5F5F5] font-cinzel border border-[#E50914] hover:bg-[#E50914]/10 transition-all duration-300',
          title: 'mb-4',
          popup: 'border border-[#E50914]/30'
        }
      });
      return;
    }

    if (selectedTwoWheelerSlots.length > 0 && selectedTwoWheelerSlots.some((_, index) => !vehicleNumbers.twoWheeler[index])) {
      Swal.fire({
        title: '<span class="font-cinzel text-xl font-bold text-[#E50914]">Attention Required</span>',
        html: '<p class="font-poppins text-[#F5F5F5]">Please enter vehicle numbers for all selected two-wheeler parking slots.</p>',
        icon: 'error',
        background: '#0D0D0D',
        confirmButtonColor: '#0D0D0D',
        confirmButtonText: 'Understood',
        customClass: {
          confirmButton: 'px-6 py-2 text-[#F5F5F5] font-cinzel border border-[#E50914] hover:bg-[#E50914]/10 transition-all duration-300',
          title: 'mb-4',
          popup: 'border border-[#E50914]/30'
        }
      });
      return;
    }

    if (selectedFourWheelerSlots.length > 0 && selectedFourWheelerSlots.some((_, index) => !vehicleNumbers.fourWheeler[index])) {
      Swal.fire({
        title: '<span class="font-cinzel text-xl font-bold text-[#E50914]">Attention Required</span>',
        html: '<p class="font-poppins text-[#F5F5F5]">Please enter vehicle numbers for all selected four-wheeler parking slots.</p>',
        icon: 'error',
        background: '#0D0D0D',
        confirmButtonColor: '#0D0D0D',
        confirmButtonText: 'Understood',
        customClass: {
          confirmButton: 'px-6 py-2 text-[#F5F5F5] font-cinzel border border-[#E50914] hover:bg-[#E50914]/10 transition-all duration-300',
          title: 'mb-4',
          popup: 'border border-[#E50914]/30'
        }
      });
      return;
    }

    handleFinalConfirmation();
  };

  return (
<div className="flex flex-col items-center p-6 bg-[#0D0D0D] min-h-screen">
  {currentUser && (
    <div className="text-center text-lg mb-6 text-[#C8A951] font-cinzel">
      <p>Welcome, {currentUser.email}</p>
    </div>
  )}
  <h1 className="text-3xl font-playfair font-bold text-center text-[#C8A951] mb-8" style={{textShadow: '0 0 10px rgba(200, 169, 81, 0.3)'}}>
    {movie} - Screen {screen} - {timing}
  </h1>
  <h1 className="text-2xl md:text-4xl font-cinzel font-semibold mb-6 text-[#F5F5F5] border-b border-[#C8A951]/30 pb-2" style={{textShadow: '0 0 8px rgba(200, 169, 81, 0.2)'}}>Select Your Seats</h1>
  <div className="grid grid-cols-8 gap-2 sm:gap-3 md:gap-4 lg:gap-6 p-6 border border-[#C8A951]/30 bg-[#121212]" style={{boxShadow: '0 0 20px rgba(0, 0, 0, 0.7), 0 0 10px rgba(200, 169, 81, 0.15)'}}>
    {Array.from({ length: totalSeats }).map((_, index) => {
      const row = rowLabels[Math.floor(index / 8)];
      const seatNumber = (index % 8) + 1;
      const isSelected = selectedSeats.includes(index);
      const category = Object.keys(seatCategories).find((cat) => seatCategories[cat].includes(index));

      return (
        <div
          key={index}
          className={`seat w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 flex justify-center items-center text-white cursor-pointer transition-all duration-300 ${
            isSelected
              ? 'bg-[#C8A951] border border-[#C8A951]/50'
              : 'bg-[#1A1A1A] border border-[#C8A951]/20 hover:bg-[#C8A951]/10'
          } ${
            category === 'Gold'
              ? 'border border-[#C8A951]'
              : category === 'Platinum'
              ? 'border border-[#E0E0E0]'
              : category === 'Silver'
              ? 'border border-[#C0C0C0]'
              : category === 'Diamond'
              ? 'border border-[#B9F2FF]'
              : 'border border-[#E50914]'
          }`}
          onClick={() => handleSeatSelection(index)}
          title={`Row: ${row}, Seat: ${seatNumber}, ${category} - $${seatPrice[category]}`}
          style={{
            boxShadow: isSelected ? '0 0 10px rgba(200, 169, 81, 0.4)' : 'none'
          }}
        >
          {`${row}${seatNumber}`}
        </div>
      );
    })}
  </div>
  
  <div className="flex flex-wrap justify-center gap-4 mt-6">
    {Object.keys(seatPrice).map(category => (
      <div key={category} className="flex items-center gap-2">
        <div className={`w-4 h-4 ${
          category === 'Gold' ? 'bg-[#C8A951]/60 border border-[#C8A951]' :
          category === 'Platinum' ? 'bg-[#E0E0E0]/60 border border-[#E0E0E0]' :
          category === 'Silver' ? 'bg-[#C0C0C0]/60 border border-[#C0C0C0]' :
          category === 'Diamond' ? 'bg-[#B9F2FF]/60 border border-[#B9F2FF]' :
          'bg-[#E50914]/60 border border-[#E50914]'
        }`}></div>
        <span className="text-[#F5F5F5] font-poppins">{category} - ${seatPrice[category]}</span>
      </div>
    ))}
  </div>

      {/* Parking Assistance Section */}
      {showParkingPrompt && (
  <div className="parking-section w-full md:w-3/4 lg:w-2/3 mt-12 p-8 border border-[#C8A951]/30 bg-[#0D0D0D]" style={{boxShadow: '0 0 20px rgba(0, 0, 0, 0.7), 0 0 10px rgba(200, 169, 81, 0.15)'}}>
    <h2 className="text-2xl font-cinzel font-semibold mb-6 text-center text-[#C8A951] border-b border-[#C8A951]/30 pb-2" style={{textShadow: '0 0 10px rgba(200, 169, 81, 0.3)'}}>
      Luxury Parking Service
    </h2>
    <div className="mb-6">
      <label className="block font-cinzel font-medium mb-2 text-[#F5F5F5]">
        Contact Number
        <input
          type="tel"
          value={phone}
          onChange={handlePhoneNumberChange}
          className="w-full p-3 bg-[#121212] border border-[#C8A951]/30 text-[#F5F5F5] focus:outline-none focus:border-[#C8A951] transition-all duration-300 font-poppins mt-1"
          style={{boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.3)'}}
          placeholder="Enter 10-digit phone number"
        />
      </label>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h3 className="text-xl font-cinzel font-medium mb-4 text-[#C8A951] border-b border-[#C8A951]/30 pb-2" style={{textShadow: '0 0 8px rgba(200, 169, 81, 0.2)'}}>
          <FontAwesomeIcon icon={faMotorcycle} className="mr-2" /> Two-Wheeler Slots
        </h3>
        <div className="grid grid-cols-5 gap-2">
          {twoWheelerSlots.map((slot, index) => (
            <div
              key={slot}
              className={`slot p-2 text-center cursor-pointer border transition-all duration-300 ${
                selectedTwoWheelerSlots.includes(slot) 
                ? 'bg-[#C8A951]/20 text-[#C8A951] border-[#C8A951]' 
                : 'bg-[#121212] border-[#C8A951]/20 text-[#F5F5F5] hover:bg-[#C8A951]/10'
              }`}
              style={{
                boxShadow: selectedTwoWheelerSlots.includes(slot) ? '0 0 10px rgba(200, 169, 81, 0.3)' : 'none'
              }}
              onClick={() => handleSlotSelection(slot, 'Two-Wheeler')}
            >
              {slot}
            </div>
          ))}
        </div>
        {selectedTwoWheelerSlots.map((slot, index) => (
          <div key={slot} className="mt-3">
            <label className="block font-poppins text-[#F5F5F5]">
              Vehicle Number for <span className="text-[#C8A951] font-medium">{slot}</span>
              <input
                type="text"
                value={vehicleNumbers.twoWheeler[index] || ''}
                onChange={(e) => handleVehicleNumberChange(e, 'twoWheeler', index)}
                className="w-full p-2 mt-1 bg-[#121212] border border-[#C8A951]/30 text-[#F5F5F5] focus:outline-none focus:border-[#C8A951] transition-all duration-300 font-poppins"
                style={{boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.3)'}}
                placeholder="Enter vehicle number"
              />
            </label>
          </div>
        ))}
      </div>

      <div>
        <h3 className="text-xl font-cinzel font-medium mb-4 text-[#C8A951] border-b border-[#C8A951]/30 pb-2" style={{textShadow: '0 0 8px rgba(200, 169, 81, 0.2)'}}>
          <FontAwesomeIcon icon={faCar} className="mr-2" /> Four-Wheeler Slots
        </h3>
        <div className="grid grid-cols-5 gap-2">
          {fourWheelerSlots.map((slot, index) => (
            <div
              key={slot}
              className={`slot p-2 text-center cursor-pointer border transition-all duration-300 ${
                selectedFourWheelerSlots.includes(slot) 
                ? 'bg-[#C8A951]/20 text-[#C8A951] border-[#C8A951]' 
                : 'bg-[#121212] border-[#C8A951]/20 text-[#F5F5F5] hover:bg-[#C8A951]/10'
              }`}
              style={{
                boxShadow: selectedFourWheelerSlots.includes(slot) ? '0 0 10px rgba(200, 169, 81, 0.3)' : 'none'
              }}
              onClick={() => handleSlotSelection(slot, 'Four-Wheeler')}
            >
              {slot}
            </div>
          ))}
        </div>
        {selectedFourWheelerSlots.map((slot, index) => (
          <div key={slot} className="mt-3">
            <label className="block font-poppins text-[#F5F5F5]">
              Vehicle Number for <span className="text-[#C8A951] font-medium">{slot}</span>
              <input
                type="text"
                value={vehicleNumbers.fourWheeler[index] || ''}
                onChange={(e) => handleVehicleNumberChange(e, 'fourWheeler', index)}
                className="w-full p-2 mt-1 bg-[#121212] border border-[#C8A951]/30 text-[#F5F5F5] focus:outline-none focus:border-[#C8A951] transition-all duration-300 font-poppins"
                style={{boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.3)'}}
                placeholder="Enter vehicle number"
              />
            </label>
          </div>
        ))}
      </div>
    </div>

    <div className="mt-8 flex justify-end">
      <button
        onClick={handleConfirmParking}
        className="bg-[#0D0D0D] border border-[#C8A951] text-[#F5F5F5] px-6 py-3 font-cinzel font-semibold transition-all duration-300 hover:bg-[#C8A951]/10"
        style={{boxShadow: '0 0 15px rgba(200, 169, 81, 0.2)'}}
      >
        Confirm Parking
      </button>
    </div>
  </div>
)}

{/* Confirm Booking Button */}
<div className="mt-10 flex justify-center">
  <button
    onClick={handleConfirm}
    className="bg-[#0D0D0D] border border-[#C8A951] text-[#F5F5F5] px-10 py-4 text-xl font-cinzel font-bold transition-all duration-300 hover:bg-[#C8A951]/10 flex items-center gap-2"
    style={{boxShadow: '0 0 15px rgba(200, 169, 81, 0.3)'}}
  >
    <FontAwesomeIcon icon={faDollarSign} className="text-[#C8A951]" />
    Confirm Booking
  </button>
</div>

    </div>
  );
};

export default Tickets;
