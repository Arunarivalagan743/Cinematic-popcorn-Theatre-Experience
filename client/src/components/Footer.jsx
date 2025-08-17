
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  return (
    <footer className="bg-[#0D0D0D] text-[#F5F5F5] py-10 mt-10 border-t border-[#C8A951]/30" style={{boxShadow: '0 -5px 15px rgba(0, 0, 0, 0.5)'}}>
      <div className="container mx-auto px-4">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold mb-3 transition-transform duration-500 hover:scale-105 text-[#C8A951] font-playfair" style={{textShadow: '0 0 10px rgba(200, 169, 81, 0.3)'}}>
              Luxury Cinematic Experience Awaits
            </h2>
            <p className="text-sm transition-opacity duration-500 hover:opacity-80 font-poppins">
              Reserve your premium tickets for an unforgettable experience
            </p>
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a
              href="#"
              className="hover:text-[#C8A951] transition-transform duration-300 transform hover:scale-110 text-[#F5F5F5]"
            >
              <FontAwesomeIcon icon={faFacebookF} className="text-3xl transition-all duration-300" style={{filter: 'drop-shadow(0 0 3px rgba(200, 169, 81, 0.3))'}} />
            </a>
            <a
              href="#"
              className="hover:text-[#C8A951] transition-transform duration-300 transform hover:scale-110 text-[#F5F5F5]"
            >
              <FontAwesomeIcon icon={faTwitter} className="text-3xl transition-all duration-300" style={{filter: 'drop-shadow(0 0 3px rgba(200, 169, 81, 0.3))'}} />
            </a>
            <a
              href="#"
              className="hover:text-[#C8A951] transition-transform duration-300 transform hover:scale-110 text-[#F5F5F5]"
            >
              <FontAwesomeIcon icon={faInstagram} className="text-3xl transition-all duration-300" style={{filter: 'drop-shadow(0 0 3px rgba(200, 169, 81, 0.3))'}} />
            </a>
          </div>
        </div>

        {/* Middle Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          <div className="transition-transform duration-500">
            <h3 className="font-cinzel text-lg font-bold mb-4 text-[#C8A951] border-b border-[#C8A951]/30 pb-2">About Us</h3>
            <ul className="space-y-3 font-poppins">
              <li><a href="/about" className="hover:text-[#C8A951] transition duration-300 border-l-2 border-transparent hover:border-[#C8A951] pl-2">Our Heritage</a></li>
              <li><a href="/about" className="hover:text-[#C8A951] transition duration-300 border-l-2 border-transparent hover:border-[#C8A951] pl-2">Join Our Team</a></li>
              <li><a href="/about" className="hover:text-[#C8A951] transition duration-300 border-l-2 border-transparent hover:border-[#C8A951] pl-2">Contact Us</a></li>
            </ul>
          </div>
          <div className="transition-transform duration-500">
            <h3 className="font-cinzel text-lg font-bold mb-4 text-[#C8A951] border-b border-[#C8A951]/30 pb-2">Guest Services</h3>
            <ul className="space-y-3 font-poppins">
              <li><a href="/faq" className="hover:text-[#C8A951] transition duration-300 border-l-2 border-transparent hover:border-[#C8A951] pl-2">FAQs</a></li>
              <li><a href="/faq" className="hover:text-[#C8A951] transition duration-300 border-l-2 border-transparent hover:border-[#C8A951] pl-2">Premium Support</a></li>
              <li><a href="/faq" className="hover:text-[#C8A951] transition duration-300 border-l-2 border-transparent hover:border-[#C8A951] pl-2">Privacy Policy</a></li>
            </ul>
          </div>
          <div className="transition-transform duration-500">
            <h3 className="font-cinzel text-lg font-bold mb-4 text-[#C8A951] border-b border-[#C8A951]/30 pb-2">Featured Films</h3>
            <ul className="space-y-3 font-poppins">
              <li><a href="/" className="hover:text-[#C8A951] transition duration-300 border-l-2 border-transparent hover:border-[#C8A951] pl-2">Now Showing</a></li>
              <li><a href="/" className="hover:text-[#C8A951] transition duration-300 border-l-2 border-transparent hover:border-[#C8A951] pl-2">Coming Soon</a></li>
              <li><a href="/" className="hover:text-[#C8A951] transition duration-300 border-l-2 border-transparent hover:border-[#C8A951] pl-2">Exclusive Premieres</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-[#C8A951]/30 pt-6 text-center">
          <p className="text-sm text-[#F5F5F5]/80 font-poppins">
            &copy; {new Date().getFullYear()} Cinematic Popcorn Park. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
