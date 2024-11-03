import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaHome, FaInfoCircle, FaTicketAlt, FaQuestionCircle } from 'react-icons/fa';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    setLoading(true);
    setTimeout(() => {
      navigate(path); // Navigate after a short delay to simulate loading
      setLoading(false);
    }, 1000); // Simulate a loading time (adjust as needed)
  };

  return (
    <div className="bg-gradient-to-r from-transparent via-purple-500 to-gray-300 text-gray-700 shadow-md sticky top-0 z-50 backdrop-blur-lg">
      <div className="max-w-6xl mx-auto p-5 flex justify-between items-center">
        <Link to="/">
          <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-500 tracking-wider animate-bounce-slow hover:text-indigo-700 transition duration-300">
            🎬 CinePop
          </h1>
        </Link>

        {/* Navigation Links */}
        <ul className="flex gap-8 items-center text-base">
          <li onClick={() => handleNavigation('/')} className="flex items-center transition duration-300 hover:text-purple-500 cursor-pointer">
            <FaHome className="mr-1 transition-transform duration-300 hover:scale-125" />
            Home
          </li>
          <li onClick={() => handleNavigation('/about')} className="flex items-center transition duration-300 hover:text-purple-500 cursor-pointer">
            <FaInfoCircle className="mr-1 transition-transform duration-300 hover:scale-125" />
            About
          </li>
          <li onClick={() => handleNavigation('/tickets')} className="flex items-center transition duration-300 hover:text-purple-500 cursor-pointer">
            <FaTicketAlt className="mr-1 transition-transform duration-300 hover:scale-125" />
            Movie Tickets
          </li>
          <li onClick={() => handleNavigation('/faq')} className="flex items-center transition duration-300 hover:text-purple-500 cursor-pointer">
            <FaQuestionCircle className="mr-1 transition-transform duration-300 hover:scale-125" />
            FAQ
          </li>
          <Link to="/profile" className="transition duration-300 hover:text-purple-500">
            {currentUser ? (
              <img
                src={currentUser.profilePicture}
                alt="profile"
                className="h-9 w-9 rounded-full border-2 border-indigo-500 shadow-md hover:scale-110 transition-transform duration-300"
              />
            ) : (
              <li className="pb-1 border-b-2 border-transparent hover:border-purple-500">Sign In</li>
            )}
          </Link>
        </ul>
      </div>

      {/* Add a decorative break element */}
      <div className="h-1 bg-gradient-to-r from-transparent to-purple-700 my-1" />

      {loading && (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 to-purple-900 text-white">
          <div className="flex items-center space-x-4 mb-4 animate-bounce">
            <FaTicketAlt className="text-6xl animate-spin" />
            <h1 className="text-3xl font-semibold">Cine Pop</h1>
          </div>
          <div className="text-center text-2xl font-semibold text-gray-300 mt-20 animate-pulse">
            Loading...
          </div>
          <div className="mt-8">
            <div className="w-32 h-2 bg-gray-300 rounded-full overflow-hidden shadow-lg">
              <div className="h-full bg-gradient-to-r from-yellow-500 to-pink-500 animate-loading" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-200 animate-fade">
            Please wait while we prepare your experience...
          </div>
        </div>
      )}
    </div>
  );
}
