// import { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import { FaHome, FaInfoCircle, FaTicketAlt, FaQuestionCircle, FaBars, FaTimes } from 'react-icons/fa';

// export default function Header() {
//   const { currentUser } = useSelector((state) => state.user);
// // Get the current language
//   const [loading, setLoading] = useState(false);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const navigate = useNavigate();

//   const handleNavigation = (path) => {
//     setLoading(true);
//     setTimeout(() => {
//       navigate(path);
//       setLoading(false);
//     }, 1000);
//     setSidebarOpen(false);
//   };

//   return (
//     <div className="bg-gradient-to-r from-transparent via-purple-700 to-gray-300 text-gray-800 shadow-md sticky top-0 z-50 backdrop-blur-lg">
//       <div className="max-w-6xl mx-auto p-4 md:p-5 flex justify-between items-center">
//         <Link to="/">
//           <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-500 tracking-wider animate-bounce-slow hover:text-indigo-700 transition duration-300 font-poppins">
//             🎬 CinePop
//           </h1>
//         </Link>

        

//         {/* Mobile menu button */}
//         <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden text-2xl focus:outline-none text-pink-500 md:text-white">
//           {sidebarOpen ? <FaTimes /> : <FaBars />}
//         </button>

//         {/* Desktop Navigation Links */}
//         <ul className="hidden md:flex flex-row gap-8 items-center text-base text-pink-500 md:text-white">
//           <li onClick={() => handleNavigation('/')} className="flex items-center transition duration-300 hover:text-yellow-500 cursor-pointer text-xl font-bold font-poppins">
//             <FaHome className="mr-1 transition-transform duration-300 hover:scale-125 text-lg" />
//             Home
//           </li>
//           <li onClick={() => handleNavigation('/about')} className="flex items-center transition duration-300 hover:text-yellow-500 cursor-pointer text-xl font-bold font-poppins">
//             <FaInfoCircle className="mr-1 transition-transform duration-300 hover:scale-125 text-lg" />
//             About
//           </li>
//           <li onClick={() => handleNavigation('/faq')} className="flex items-center transition duration-300 hover:text-yellow-500 cursor-pointer text-xl font-bold font-poppins">
//             <FaQuestionCircle className="mr-1 transition-transform duration-300 hover:scale-125 text-lg" />
//             FAQ
//           </li>
          
//           <Link to="/profile" className="transition duration-300 hover:text-yellow-500">
//             {currentUser ? (
//               <img
//                 src={currentUser.profilePicture}
//                 alt="profile"
//                 className="h-9 w-9 rounded-full border-2 border-indigo-500 shadow-md hover:scale-110 transition-transform duration-300"
//               />
//             ) : (
//               <li className="pb-1 border-b-2 border-transparent hover:border-purple-500 text-xl font-bold font-poppins">Sign In</li>
//             )}
//           </Link>
//         </ul>

//         {/* Sidebar for Mobile */}
//         {sidebarOpen && (
//           <>
//             <div className="fixed inset-0 bg-black opacity-50 z-30" onClick={() => setSidebarOpen(false)} />

//             <div className="fixed inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-purple-800 via-purple-700 to-red-600 text-pink-500 shadow-lg transform transition-transform duration-300 md:hidden">
//               <div className="p-5 space-y-4">
//                 <h1 className="text-xl font-extrabold text-white font-poppins">🎬 CinePop</h1>
//                 <ul className="flex flex-col gap-6 text-lg">
//                   <li onClick={() => handleNavigation('/home')} className="flex items-center transition duration-300 hover:text-green-300 cursor-pointer font-poppins">
//                     <FaHome className="mr-3 " />
//                     Home
//                   </li>
//                   <li onClick={() => handleNavigation('/about')} className="flex items-center transition duration-300 hover:text-green-300 cursor-pointer  font-poppins">
//                     <FaInfoCircle className="mr-3" />
//                     About
//                   </li>
//                   <li onClick={() => handleNavigation('/faq')} className="flex items-center transition duration-300 hover:text-green-300 cursor-pointer font-poppins">
//                     <FaQuestionCircle className="mr-3 " />
//                     FAQ
//                   </li>
         
//                   <Link to="/profile" className="transition duration-300 hover:text-green-300">
//                     {currentUser ? (
//                       <img
//                         src={currentUser.profilePicture}
//                         alt="profile"
//                         className="h-9 w-9 rounded-full border-2 border-white shadow-md hover:scale-110 transition-transform duration-300"
//                       />
//                     ) : (
//                       <li className="pb-1 border-b-2 border-transparent hover:border-gray-300  font-poppins">Sign In</li>
//                     )}
//                   </Link>
//                 </ul>
//               </div>
//             </div>
//           </>
//         )}
//       </div>

//       {/* Decorative break element */}
//       <div className="h-1 bg-gradient-to-r from-transparent to-purple-400 my-1" />

//       {loading && (
//         <div className="fixed inset-0 flex flex-col items-center justify-center min-h-screen bg-gradient-to-br text-white z-50">
//           <div className="flex items-center space-x-4 mb-4 animate-bounce">
//             <FaTicketAlt className="text-4xl md:text-6xl animate-spin" />
//             <h1 className="text-2xl md:text-3xl font-semibold font-poppins">Cine Pop</h1>
//           </div>
//           <div className="text-center text-xl md:text-2xl font-semibold text-gray-300 mt-8 md:mt-20 animate-pulse">
//             Loading...
//           </div>
//           <div className="mt-8">
//             <div className="w-24 md:w-32 h-2 bg-gray-300 rounded-full overflow-hidden shadow-lg">
//               <div className="h-full bg-gradient-to-r from-yellow-500 to-pink-500 animate-loading" />
//             </div>
//           </div>
//           <div className="mt-4 text-xs md:text-sm text-gray-200 animate-fade">
//             Please wait while we prepare your experience...
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
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
            to="/profile"
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

