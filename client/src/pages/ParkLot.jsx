import React, { useState } from 'react';
import { FaMotorcycle, FaCar } from 'react-icons/fa';

const ParkLot = () => {
  const totalTwoWheelerSpots = 20;
  const totalFourWheelerSpots = 18;

  // State to track booked spots for both types
  const [bookedTwoWheelerSpots, setBookedTwoWheelerSpots] = useState(new Array(totalTwoWheelerSpots).fill(false));
  const [bookedFourWheelerSpots, setBookedFourWheelerSpots] = useState(new Array(totalFourWheelerSpots).fill(false));
  
  // Selected spots for both two-wheeler and four-wheeler
  const [selectedTwoWheelerSpot, setSelectedTwoWheelerSpot] = useState(null);
  const [selectedFourWheelerSpot, setSelectedFourWheelerSpot] = useState(null);

  // Function to handle spot booking for two-wheelers
  const handleTwoWheelerSelection = (index) => {
    const updatedSpots = [...bookedTwoWheelerSpots];
    updatedSpots[index] = !updatedSpots[index]; // Toggle booking status
    setBookedTwoWheelerSpots(updatedSpots);
    setSelectedTwoWheelerSpot(updatedSpots[index] ? `T${index + 1}` : null); // Set the selected spot if booked
  };

  // Function to handle spot booking for four-wheelers
  const handleFourWheelerSelection = (index) => {
    const updatedSpots = [...bookedFourWheelerSpots];
    updatedSpots[index] = !updatedSpots[index]; // Toggle booking status
    setBookedFourWheelerSpots(updatedSpots);
    setSelectedFourWheelerSpot(updatedSpots[index] ? `F${index + 1}` : null); // Set the selected spot if booked
  };

  const getCost = (type) => {
    return type === 'Two-Wheeler' ? 10 : 20; // Two-Wheeler cost is 10, Four-Wheeler cost is 20
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 to-gray-900 text-white p-4 lg:p-8">
      <h1 className="text-4xl font-bold text-center text-green-300 mb-8">
        <span className="hover:text-green-400 transition duration-300">
          Parking Assistance
        </span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Two-Wheelers Section */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg relative overflow-hidden">
          <h2 className="text-2xl font-semibold text-center text-yellow-400 mb-6">Two-Wheeler Parking</h2>
          <div className="absolute top-0 left-0 w-full h-full bg-leaf-pattern opacity-10 pointer-events-none"></div>
          <div className="grid grid-cols-5 gap-4">
            {[...Array(totalTwoWheelerSpots)].map((_, index) => (
              <div
                key={index}
                onClick={() => handleTwoWheelerSelection(index)}
                className={`relative p-6 rounded-lg cursor-pointer transform transition duration-300 hover:scale-105
                  ${bookedTwoWheelerSpots[index]
                    ? 'bg-red-600 scale-105 border-2 border-red-400 shadow-lg' // Booked spot styling
                    : 'bg-blue-600 hover:bg-blue-700 animate-pulse shadow-md'}`
                }
              >
                <FaMotorcycle className="text-2xl text-yellow-300 mx-auto mb-2" />
                <span className="text-center font-semibold block">
                  T{index + 1} {bookedTwoWheelerSpots[index] ? '(Booked)' : ''}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Four-Wheelers Section */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg relative overflow-hidden">
          <h2 className="text-2xl font-semibold text-center text-yellow-400 mb-6">Four-Wheeler Parking</h2>
          <div className="absolute top-0 left-0 w-full h-full bg-road-pattern opacity-10 pointer-events-none"></div>
          <div className="grid grid-cols-4 gap-4">
            {[...Array(totalFourWheelerSpots)].map((_, index) => (
              <div
                key={index}
                onClick={() => handleFourWheelerSelection(index)}
                className={`relative p-6 rounded-lg cursor-pointer transform transition duration-300 hover:scale-105
                  ${bookedFourWheelerSpots[index]
                    ? 'bg-red-600 scale-105 border-2 border-red-400 shadow-lg' // Booked spot styling
                    : 'bg-green-600 hover:bg-green-700 animate-pulse shadow-md'}`
                }
              >
                <FaCar className="text-2xl text-yellow-300 mx-auto mb-2" />
                <span className="text-center font-semibold block">
                  F{index + 1} {bookedFourWheelerSpots[index] ? '(Booked)' : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Display Selected Spots */}
      <div className="mt-10 text-center bg-gray-900 p-6 rounded-lg shadow-lg border-2 border-green-500">
        <p className="text-2xl font-semibold text-green-400 mb-2">
          {selectedTwoWheelerSpot && (
            <span>
              Selected Two-Wheeler Spot: <span className="text-yellow-300">{selectedTwoWheelerSpot}</span>
            </span>
          )}
          {selectedTwoWheelerSpot && selectedFourWheelerSpot && <span className="text-white mx-2">|</span>}
          {selectedFourWheelerSpot && (
            <span>
              Selected Four-Wheeler Spot: <span className="text-yellow-300">{selectedFourWheelerSpot}</span>
            </span>
          )}
        </p>

        {/* Show Cost */}
        {selectedTwoWheelerSpot || selectedFourWheelerSpot ? (
          <p className="text-xl text-yellow-400">
            Total Cost: ₹
            {selectedTwoWheelerSpot ? 10 : 0} + {selectedFourWheelerSpot ? 20 : 0} = ₹
            {selectedTwoWheelerSpot ? 10 : 0} + {selectedFourWheelerSpot ? 20 : 0} ={' '}
            {10 + 20}
          </p>
        ) : (
          <p className="text-xl text-gray-400">No spots selected yet.</p>
        )}
      </div>
    </div>
  );
};

export default ParkLot;
