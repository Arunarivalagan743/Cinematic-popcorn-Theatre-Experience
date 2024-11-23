import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaHome, FaInfoCircle, FaTicketAlt, FaQuestionCircle, FaBars, FaTimes } from 'react-icons/fa';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
// Get the current language
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    setLoading(true);
    setTimeout(() => {
      navigate(path);
      setLoading(false);
    }, 1000);
    setSidebarOpen(false);
  };

  return (
    <div className="bg-gradient-to-r from-transparent via-purple-700 to-gray-300 text-gray-800 shadow-md sticky top-0 z-50 backdrop-blur-lg">
      <div className="max-w-6xl mx-auto p-4 md:p-5 flex justify-between items-center">
        <Link to="/">
          <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-500 tracking-wider animate-bounce-slow hover:text-indigo-700 transition duration-300 font-poppins">
            🎬 CinePop
          </h1>
        </Link>

        

        {/* Mobile menu button */}
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden text-2xl focus:outline-none text-pink-500 md:text-white">
          {sidebarOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Desktop Navigation Links */}
        <ul className="hidden md:flex flex-row gap-8 items-center text-base text-pink-500 md:text-white">
          <li onClick={() => handleNavigation('/')} className="flex items-center transition duration-300 hover:text-yellow-500 cursor-pointer text-xl font-bold font-poppins">
            <FaHome className="mr-1 transition-transform duration-300 hover:scale-125 text-lg" />
            Home
          </li>
          <li onClick={() => handleNavigation('/about')} className="flex items-center transition duration-300 hover:text-yellow-500 cursor-pointer text-xl font-bold font-poppins">
            <FaInfoCircle className="mr-1 transition-transform duration-300 hover:scale-125 text-lg" />
            About
          </li>
          <li onClick={() => handleNavigation('/faq')} className="flex items-center transition duration-300 hover:text-yellow-500 cursor-pointer text-xl font-bold font-poppins">
            <FaQuestionCircle className="mr-1 transition-transform duration-300 hover:scale-125 text-lg" />
            FAQ
          </li>
          <li onClick={() => handleNavigation('/parkLot')} className="flex items-center transition duration-300 hover:text-green-300 cursor-pointer font-poppins">
                    <FaQuestionCircle className="mr-3 " />
                    LOT
                  </li>
          <Link to="/profile" className="transition duration-300 hover:text-yellow-500">
            {currentUser ? (
              <img
                src={currentUser.profilePicture}
                alt="profile"
                className="h-9 w-9 rounded-full border-2 border-indigo-500 shadow-md hover:scale-110 transition-transform duration-300"
              />
            ) : (
              <li className="pb-1 border-b-2 border-transparent hover:border-purple-500 text-xl font-bold font-poppins">Sign In</li>
            )}
          </Link>
        </ul>

        {/* Sidebar for Mobile */}
        {sidebarOpen && (
          <>
            <div className="fixed inset-0 bg-black opacity-50 z-30" onClick={() => setSidebarOpen(false)} />

            <div className="fixed inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-purple-800 via-purple-700 to-red-600 text-pink-500 shadow-lg transform transition-transform duration-300 md:hidden">
              <div className="p-5 space-y-4">
                <h1 className="text-xl font-extrabold text-white font-poppins">🎬 CinePop</h1>
                <ul className="flex flex-col gap-6 text-lg">
                  <li onClick={() => handleNavigation('/home')} className="flex items-center transition duration-300 hover:text-green-300 cursor-pointer font-poppins">
                    <FaHome className="mr-3 " />
                    Home
                  </li>
                  <li onClick={() => handleNavigation('/about')} className="flex items-center transition duration-300 hover:text-green-300 cursor-pointer  font-poppins">
                    <FaInfoCircle className="mr-3" />
                    About
                  </li>
                  <li onClick={() => handleNavigation('/faq')} className="flex items-center transition duration-300 hover:text-green-300 cursor-pointer font-poppins">
                    <FaQuestionCircle className="mr-3 " />
                    FAQ
                  </li>
         
                  <Link to="/profile" className="transition duration-300 hover:text-green-300">
                    {currentUser ? (
                      <img
                        src={currentUser.profilePicture}
                        alt="profile"
                        className="h-9 w-9 rounded-full border-2 border-white shadow-md hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <li className="pb-1 border-b-2 border-transparent hover:border-gray-300  font-poppins">Sign In</li>
                    )}
                  </Link>
                </ul>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Decorative break element */}
      <div className="h-1 bg-gradient-to-r from-transparent to-purple-400 my-1" />

      {loading && (
        <div className="fixed inset-0 flex flex-col items-center justify-center min-h-screen bg-gradient-to-br text-white z-50">
          <div className="flex items-center space-x-4 mb-4 animate-bounce">
            <FaTicketAlt className="text-4xl md:text-6xl animate-spin" />
            <h1 className="text-2xl md:text-3xl font-semibold font-poppins">Cine Pop</h1>
          </div>
          <div className="text-center text-xl md:text-2xl font-semibold text-gray-300 mt-8 md:mt-20 animate-pulse">
            Loading...
          </div>
          <div className="mt-8">
            <div className="w-24 md:w-32 h-2 bg-gray-300 rounded-full overflow-hidden shadow-lg">
              <div className="h-full bg-gradient-to-r from-yellow-500 to-pink-500 animate-loading" />
            </div>
          </div>
          <div className="mt-4 text-xs md:text-sm text-gray-200 animate-fade">
            Please wait while we prepare your experience...
          </div>
        </div>
      )}
    </div>
  );
}
