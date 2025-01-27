

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FaHome,
  FaInfoCircle,
  FaTicketAlt,
  FaQuestionCircle,
  FaBars,
  FaTimes,
  FaSignInAlt,
} from "react-icons/fa";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
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
    <div className="bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 text-gray-900 shadow-lg sticky top-0 z-50 font-inter">
      {/* Container */}
      <div className="max-w-full px-4 md:px-6 lg:px-10 flex justify-between items-center py-3">
        {/* Brand Logo */}
        <Link to="/" className="group">
          <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-600 tracking-wide animate-fade-in hover:scale-110 hover:cursor-pointer transition-transform duration-300">
            🎥 CinePop
          </h1>
        </Link>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden text-2xl focus:outline-none text-blue-500 transition-all duration-300 hover:scale-110"
        >
          {sidebarOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex flex-grow justify-evenly items-center text-gray-700">
          {[
            { name: "Home", icon: <FaHome />, path: "/" },
            { name: "About", icon: <FaInfoCircle />, path: "/about" },
            { name: "FAQ", icon: <FaQuestionCircle />, path: "/faq" },
          ].map(({ name, icon, path }) => (
            <li
              key={name}
              onClick={() => handleNavigation(path)}
              className="flex items-center gap-2 text-lg font-medium transition-all duration-300 cursor-pointer px-3 py-2 hover:text-blue-500 hover:scale-105 hover:shadow-md rounded-lg group"
            >
              <span className="text-xl group-hover:rotate-12 transition-transform duration-300">
                {icon}
              </span>
              {name}
            </li>
          ))}

          {/* Profile or Sign In */}
          <Link
            to={currentUser ? "/profile" : "/sign-in"}
            className="transition-all duration-300 hover:scale-110"
          >
            {currentUser ? (
              <img
                src={currentUser.profilePicture}
                alt="profile"
                className="h-10 w-10 rounded-full border-2 border-gray-400 shadow-md hover:scale-110 transition-transform duration-300"
              />
            ) : (
              <li className="text-lg font-medium px-3 py-2 hover:text-blue-500 border-b-2 border-transparent hover:border-blue-500 rounded-lg">
                Sign In
              </li>
            )}
          </Link>
        </ul>

        {/* Sidebar for Mobile */}
        {sidebarOpen && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-30"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="fixed inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200 text-gray-800 shadow-xl transform transition-transform duration-300">
              <div className="p-5 space-y-4">
                <h1 className="text-2xl font-extrabold text-gray-700">
                  🎥 CinePop
                </h1>
                <ul className="flex flex-col gap-6 text-lg">
                  {[
                    { name: "Home", icon: <FaHome />, path: "/" },
                    { name: "About", icon: <FaInfoCircle />, path: "/about" },
                    { name: "FAQ", icon: <FaQuestionCircle />, path: "/faq" },
                  ].map(({ name, icon, path }) => (
                    <li
                      key={name}
                      onClick={() => handleNavigation(path)}
                      className="flex items-center gap-3 text-gray-800 font-medium px-3 py-2 hover:bg-gray-200 rounded-lg transition-all duration-300"
                    >
                      <span className="text-xl">{icon}</span>
                      {name}
                    </li>
                  ))}

                  {/* Profile or Sign In */}
                  <li
                    onClick={() =>
                      currentUser
                        ? handleNavigation("/profile")
                        : handleNavigation("/sign-in")
                    }
                    className="flex items-center gap-3 text-gray-800 font-medium px-3 py-2 hover:bg-gray-200 rounded-lg transition-all duration-300 cursor-pointer"
                  >
                    {currentUser ? (
                      <>
                        <img
                          src={currentUser.profilePicture}
                          alt="profile"
                          className="h-10 w-10 rounded-full border-2 border-gray-400 shadow-md"
                        />
                        <span>Profile</span>
                      </>
                    ) : (
                      <>
                        <FaSignInAlt className="text-xl" />
                        <span>Sign In</span>
                      </>
                    )}
                  </li>
                </ul>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Decorative Gradient Line */}
      <div className="h-1 bg-gradient-to-r from-teal-400 to-blue-500 my-1 animate-slide-right" />

      {/* Loading Screen */}
      {loading && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-white to-gray-100 z-50">
          <div className="flex items-center space-x-4 mb-4 animate-bounce">
            <FaTicketAlt className="text-4xl md:text-6xl text-blue-500" />
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">
              CinePop
            </h1>
          </div>
          <div className="text-center text-lg font-medium text-gray-600 mt-8">
            Loading your experience...
          </div>
          <div className="w-24 h-2 mt-6 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-teal-400 animate-loading" />
          </div>
        </div>
      )}
    </div>
  );
}
