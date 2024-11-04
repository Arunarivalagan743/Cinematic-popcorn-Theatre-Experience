import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';

// Sample movie images array

const Footer = () => {
  // const [visibleImages, setVisibleImages] = useState([]);

  // useEffect(() => {
  //   // Simulating fetching movie images or updating the state
  //   const timer = setTimeout(() => {
  //     setVisibleImages(movieImages);
  //   }, 100); // Delay to simulate loading

  //   return () => clearTimeout(timer);
  // }, []);

  return (
    <footer className="bg-gradient-to-r from-gray-900 to-purple-900 text-white py-8 mt-10 transition-transform duration-500 ease-in-out transform hover:scale-105">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold mb-2 transition-opacity duration-500 hover:opacity-80">Cinematic Experience Awaits</h2>
            <p className="text-sm transition-opacity duration-500 hover:opacity-80">Book your tickets now for the latest movies!</p>
          </div>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a 
              href="#" 
              className="hover:text-yellow-400 transition duration-300 transform hover:scale-125 hover:rotate-12"
            >
              <FontAwesomeIcon icon={faFacebookF} className="text-3xl" />
            </a>
            <a 
              href="#" 
              className="hover:text-yellow-400 transition duration-300 transform hover:scale-125 hover:rotate-12"
            >
              <FontAwesomeIcon icon={faTwitter} className="text-3xl" />
            </a>
            <a 
              href="#" 
              className="hover:text-yellow-400 transition duration-300 transform hover:scale-125 hover:rotate-12"
            >
              <FontAwesomeIcon icon={faInstagram} className="text-3xl" />
            </a>
          </div>
        </div>



        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <h3 className="font-bold mb-2 transition-transform duration-500 hover:scale-110">About Us</h3>
            <ul>
              <li><a href="#" className="hover:text-yellow-400 transition duration-300">Our Story</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition duration-300">Careers</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition duration-300">Contact Us</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-2 transition-transform duration-500 hover:scale-110">Help</h3>
            <ul>
              <li><a href="#" className="hover:text-yellow-400 transition duration-300">FAQs</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition duration-300">Support</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition duration-300">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-2 transition-transform duration-500 hover:scale-110">Movies</h3>
            <ul>
              <li><a href="#" className="hover:text-yellow-400 transition duration-300">Now Showing</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition duration-300">Coming Soon</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition duration-300">Popular Movies</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-4 text-center">
          <p className="text-sm transition-opacity duration-500 hover:opacity-80">&copy; {new Date().getFullYear()} Movie Ticket Booking. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
