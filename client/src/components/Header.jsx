

import { useState, useEffect } from "react";
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
  FaEnvelope,
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
    <div className="bg-[#0D0D0D] text-[#F5F5F5] shadow-lg sticky top-0 z-50 font-[Playfair Display], serif">
      {/* Container */}
      <div className="max-w-full px-4 md:px-6 lg:px-10 flex justify-between items-center py-4">
        {/* Brand Logo */}
        <Link to="/" className="group">
          <h1 className="text-3xl md:text-4xl font-bold font-cinzel text-transparent bg-clip-text bg-gradient-to-r from-[#C8A951] via-[#DFBD69] to-[#9E7E38] tracking-wide hover:scale-105 hover:cursor-pointer transition-transform duration-300" 
              style={{
                textShadow: '0 0 12px rgba(200, 169, 81, 0.4), 0 0 4px rgba(255, 255, 255, 0.1)',
                letterSpacing: '0.05em'
              }}>
             Cinematic Popcorn Park
          </h1>
        </Link>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden text-2xl focus:outline-none text-[#C8A951] transition-all duration-300 hover:scale-105"
        >
          {sidebarOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex flex-grow justify-evenly items-center text-[#F5F5F5]">
          {[
            { name: "Home", icon: <FaHome />, path: "/" },
            { name: "About", icon: <FaInfoCircle />, path: "/about" },
            { name: "Contact", icon: <FaEnvelope />, path: "/contact" },
            { name: "FAQ", icon: <FaQuestionCircle />, path: "/faq" },
          ].map(({ name, icon, path }) => (
            <li
              key={name}
              onClick={() => handleNavigation(path)}
              className="flex items-center gap-2 text-lg font-medium transition-all duration-300 cursor-pointer px-3 py-2 hover:text-[#C8A951] border-b border-transparent hover:border-[#C8A951] group"
            >
              <span className="text-xl text-[#C8A951] group-hover:text-[#E50914] transition-all duration-300">
                {icon}
              </span>
              {name}
            </li>
          ))}

          {/* Profile or Sign In */}
          <Link
            to={currentUser ? "/profile" : "/sign-in"}
            className="transition-all duration-300 hover:scale-105"
          >
            {currentUser ? (
              <img
                src={currentUser.profilePicture}
                alt="profile"
                className="h-10 w-10 border-2 border-[#C8A951] shadow-md hover:shadow-[#C8A951]/30 transition-all duration-300"
                style={{boxShadow: '0 0 10px rgba(200, 169, 81, 0.3)'}}
              />
            ) : (
              <li className="text-lg font-medium px-4 py-2 hover:text-[#C8A951] border border-[#C8A951] hover:shadow-md hover:shadow-[#C8A951]/30">
                Sign In
              </li>
            )}
          </Link>
        </ul>

        {/* Sidebar for Mobile */}
        {sidebarOpen && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-80 z-30"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="fixed inset-y-0 left-0 z-40 w-64 bg-[#0D0D0D] text-[#F5F5F5] shadow-xl transform transition-transform duration-300" style={{boxShadow: '0 0 15px rgba(200, 169, 81, 0.2)'}}>
              <div className="p-5 space-y-6">
                <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#C8A951] to-[#E50914]" style={{textShadow: '0 0 10px rgba(200, 169, 81, 0.3)'}}>
                  🎥 Cinematic Popcorn Park
                </h1>
                <ul className="flex flex-col gap-6 text-lg font-[Poppins], sans-serif mt-8">
                  {[
                    { name: "Home", icon: <FaHome />, path: "/" },
                    { name: "About", icon: <FaInfoCircle />, path: "/about" },
                    { name: "Contact", icon: <FaEnvelope />, path: "/contact" },
                    { name: "FAQ", icon: <FaQuestionCircle />, path: "/faq" },
                  ].map(({ name, icon, path }) => (
                    <li
                      key={name}
                      onClick={() => handleNavigation(path)}
                      className="flex items-center gap-3 text-[#F5F5F5] font-medium px-3 py-2 hover:bg-[#0D0D0D] hover:text-[#C8A951] border-l-2 border-transparent hover:border-[#C8A951] transition-all duration-300"
                    >
                      <span className="text-xl text-[#C8A951]">{icon}</span>
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
                    className="flex items-center gap-3 text-[#F5F5F5] font-medium px-3 py-2 hover:bg-[#0D0D0D] hover:text-[#C8A951] border-l-2 border-transparent hover:border-[#C8A951] transition-all duration-300 cursor-pointer mt-4"
                  >
                    {currentUser ? (
                      <>
                        <img
                          src={currentUser.profilePicture}
                          alt="profile"
                          className="h-10 w-10 border-2 border-[#C8A951]"
                          style={{boxShadow: '0 0 10px rgba(200, 169, 81, 0.3)'}}
                        />
                        <span>Profile</span>
                      </>
                    ) : (
                      <>
                        <FaSignInAlt className="text-xl text-[#C8A951]" />
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
      <div className="h-0.5 bg-gradient-to-r from-[#C8A951] via-[#E50914] to-[#C8A951] animate-slide-right" style={{boxShadow: '0 0 5px rgba(200, 169, 81, 0.5)'}} />

      {/* Loading Screen */}
      {loading && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#0D0D0D] z-50">
          <div className="flex items-center space-x-4 mb-4 animate-bounce">
            <FaTicketAlt className="text-4xl md:text-6xl text-[#C8A951]" style={{filter: 'drop-shadow(0 0 8px rgba(200, 169, 81, 0.5))'}} />
            <h1 className="text-2xl md:text-3xl font-[Cinzel], serif text-[#F5F5F5]" style={{textShadow: '0 0 10px rgba(200, 169, 81, 0.3)'}}>
              Cinematic Popcorn Park
            </h1>
          </div>
          <div className="text-center text-lg font-medium text-[#F5F5F5] mt-8 font-[Poppins], sans-serif">
            Preparing your premium experience...
          </div>
          <div className="w-32 h-1 mt-6 bg-[#0D0D0D] overflow-hidden border border-[#C8A951]">
            <div className="h-full bg-gradient-to-r from-[#C8A951] to-[#E50914] animate-loading" style={{boxShadow: '0 0 8px rgba(200, 169, 81, 0.5)'}} />
          </div>
        </div>
      )}
    </div>
  );
}
