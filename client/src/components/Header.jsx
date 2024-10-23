import React from 'react';

const Header = () => {
  return (
    <header className="bg-green-800 text-red-800shadow-lg transition-all duration-300 ease-in-out">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo with scale transition */}
        <div className="text-2xl font-bold transform transition-transform duration-300 ease-in-out hover:scale-110">
          <a href="/" className="hover:text-violet-500">
            MovieTickets
          </a>
        </div>

        {/* Navigation Links with smooth hover effect */}
        <nav>
          <ul className="flex space-x-6">
            <li className="transform transition-all duration-300 ease-in-out hover:scale-105">
              <a href="/" className="hover:text-yellow-500">
                Home
              </a>
            </li>
            <li className="transform transition-all duration-300 ease-in-out hover:scale-105">
              <a href="/movies" className="hover:text-yellow-500">
                Movies
              </a>
            </li>
            <li className="transform transition-all duration-300 ease-in-out hover:scale-105">
              <a href="/contact" className="hover:text-yellow-500">
                Contact
              </a>
            </li>
          </ul>
        </nav>

        {/* User/Login Button with hover animation */}
        <div>
          <a
            href="/sign-in"
            className="bg-purple-600-500 text-black px-4 py-2 rounded-lg transform transition-all duration-300 ease-in-out hover:bg-yellow-600 hover:scale-105"
          >
            Login
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
