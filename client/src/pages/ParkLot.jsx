import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar, faMotorcycle } from '@fortawesome/free-solid-svg-icons';

const Ticket = () => {
  const navigate = useNavigate();
  const [selectedTwoWheelerSlots, setSelectedTwoWheelerSlots] = useState([]);
  const [selectedFourWheelerSlots, setSelectedFourWheelerSlots] = useState([]);
  const [phone, setPhone] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [errors, setErrors] = useState({});

  const twoWheelerSlots = ["T1", "T2", "T3", "T4"];
  const fourWheelerSlots = ["F1", "F2", "F3", "F4"];

  // Updated prices for two-wheeler and four-wheeler parking
  const twoWheelerPrice = 20; // Price for two-wheeler parking per slot
  const fourWheelerPrice = 30; // Price for four-wheeler parking per slot

  // Calculate total parking cost
  const totalParkingCost =
    selectedTwoWheelerSlots.length * twoWheelerPrice +
    selectedFourWheelerSlots.length * fourWheelerPrice;

  const handleSlotSelection = (slot, type) => {
    if (type === "Two-Wheeler") {
      // Toggle selection for two-wheeler slots
      setSelectedTwoWheelerSlots((prev) =>
        prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
      );
    } else if (type === "Four-Wheeler") {
      // Toggle selection for four-wheeler slots
      setSelectedFourWheelerSlots((prev) =>
        prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
      );
    }
  };

  const handleConfirmParking = () => {
    if (
      !phone ||
      !vehicleNumber ||
      (selectedTwoWheelerSlots.length === 0 &&
        selectedFourWheelerSlots.length === 0)
    ) {
      setErrors({ parking: "All parking details are mandatory." });
      return;
    }

    const parkingDetails = {
      selectedTwoWheelerSlots,
      selectedFourWheelerSlots,
      phone,
      vehicleNumber,
      totalParkingCost,
    };

    // Store parking details in localStorage
    localStorage.setItem("parkingDetails", JSON.stringify(parkingDetails));

    // Retrieve movie booking details
    const bookingData = JSON.parse(localStorage.getItem("bookingData")) || {};

    // Add parking details to the booking data
    bookingData.parkingDetails = parkingDetails;

    // Update the total cost with parking cost
    bookingData.totalCost = (bookingData.totalCost || 0) + totalParkingCost;

    // Store updated booking data in localStorage
    localStorage.setItem("bookingData", JSON.stringify(bookingData));

    // Navigate to payment page
    navigate("/payment");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 text-white p-4 lg:p-8">
      <h1 className="text-3xl font-bold text-center text-yellow-500 mb-6">Parking Selection</h1>

      <div className="text-center mb-8">
        <p className="text-xl font-semibold">Select Two-Wheeler Slots</p>
        <div className="flex justify-center space-x-4 mt-4">
          {twoWheelerSlots.map((slot) => (
            <button
              key={slot}
              className={`p-4 rounded-lg border-2 ${
                selectedTwoWheelerSlots.includes(slot)
                  ? "bg-green-500"
                  : "bg-gray-500"
              }`}
              onClick={() => handleSlotSelection(slot, "Two-Wheeler")}
            >
              {slot}
            </button>
          ))}
        </div>
      </div>

      <div className="text-center mb-8">
        <p className="text-xl font-semibold">Select Four-Wheeler Slots</p>
        <div className="flex justify-center space-x-4 mt-4">
          {fourWheelerSlots.map((slot) => (
            <button
              key={slot}
              className={`p-4 rounded-lg border-2 ${
                selectedFourWheelerSlots.includes(slot)
                  ? "bg-blue-500"
                  : "bg-gray-500"
              }`}
              onClick={() => handleSlotSelection(slot, "Four-Wheeler")}
            >
              {slot}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full p-3 rounded-lg bg-gray-700 text-white"
        />
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Vehicle Number"
          value={vehicleNumber}
          onChange={(e) => setVehicleNumber(e.target.value)}
          className="w-full p-3 rounded-lg bg-gray-700 text-white"
        />
      </div>

      {errors.parking && <p className="text-red-500">{errors.parking}</p>}

      <div className="mt-8 text-center">
        <p className="text-xl font-semibold mb-4">Total Parking Cost: ${totalParkingCost}</p>
        <button
          onClick={handleConfirmParking}
          className="bg-gradient-to-r from-green-500 to-blue-500 py-3 px-8 rounded-lg text-white font-bold transition duration-300 ease-in-out hover:bg-blue-400"
        >
          Confirm Parking and Proceed to Payment
        </button>
      </div>
    </div>
  );
};

export default Ticket;
