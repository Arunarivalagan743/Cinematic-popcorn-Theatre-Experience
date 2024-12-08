
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white py-8 mt-10 transition-all duration-500 ease-in-out hover:scale-105">
      <div className="container mx-auto px-4">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold mb-2 transition-transform duration-500 hover:scale-110 hover:text-yellow-300">
              Cinematic Experience Awaits
            </h2>
            <p className="text-sm transition-opacity duration-500 hover:opacity-80">
              Book your tickets now for the latest movies!
            </p>
          </div>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a
              href="#"
              className="hover:text-yellow-400 transition-transform duration-300 transform hover:scale-125 hover:rotate-12 hover:text-xl"
            >
              <FontAwesomeIcon icon={faFacebookF} className="text-3xl hover:text-yellow-300 transition-transform duration-300" />
            </a>
            <a
              href="#"
              className="hover:text-yellow-400 transition-transform duration-300 transform hover:scale-125 hover:rotate-12 hover:text-xl"
            >
              <FontAwesomeIcon icon={faTwitter} className="text-3xl hover:text-yellow-300 transition-transform duration-300" />
            </a>
            <a
              href="#"
              className="hover:text-yellow-400 transition-transform duration-300 transform hover:scale-125 hover:rotate-12 hover:text-xl"
            >
              <FontAwesomeIcon icon={faInstagram} className="text-3xl hover:text-yellow-300 transition-transform duration-300" />
            </a>
          </div>
        </div>

        {/* Middle Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="transition-transform duration-500 hover:scale-105">
            <h3 className="font-bold mb-2 transition-transform duration-500 hover:scale-110 hover:text-yellow-300">About Us</h3>
            <ul>
              <li><a href="/about" className="hover:text-yellow-400 transition duration-300 transform hover:scale-110">Our Story</a></li>
              <li><a href="/about" className="hover:text-yellow-400 transition duration-300 transform hover:scale-110">Careers</a></li>
              <li><a href="/about" className="hover:text-yellow-400 transition duration-300 transform hover:scale-110">Contact Us</a></li>
            </ul>
          </div>
          <div className="transition-transform duration-500 hover:scale-105">
            <h3 className="font-bold mb-2 transition-transform duration-500 hover:scale-110 hover:text-yellow-300">Help</h3>
            <ul>
              <li><a href="/faq" className="hover:text-yellow-400 transition duration-300 transform hover:scale-110">FAQs</a></li>
              <li><a href="/faq" className="hover:text-yellow-400 transition duration-300 transform hover:scale-110">Support</a></li>
              <li><a href="/faq" className="hover:text-yellow-400 transition duration-300 transform hover:scale-110">Privacy Policy</a></li>
            </ul>
          </div>
          <div className="transition-transform duration-500 hover:scale-105">
            <h3 className="font-bold mb-2 transition-transform duration-500 hover:scale-110 hover:text-yellow-300">Movies</h3>
            <ul>
              <li><a href="/" className="hover:text-yellow-400 transition duration-300 transform hover:scale-110">Now Showing</a></li>
              <li><a href="/" className="hover:text-yellow-400 transition duration-300 transform hover:scale-110">Coming Soon</a></li>
              <li><a href="/" className="hover:text-yellow-400 transition duration-300 transform hover:scale-110">Popular Movies</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 pt-4 text-center transition-transform duration-500 hover:scale-105">
          <p className="text-sm transition-opacity duration-500 hover:opacity-80">
            &copy; {new Date().getFullYear()} Movie Ticket Booking. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
