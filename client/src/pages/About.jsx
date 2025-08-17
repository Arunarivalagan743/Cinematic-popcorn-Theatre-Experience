
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilm, faTicketAlt, faUsers } from '@fortawesome/free-solid-svg-icons';
import Footer from '../components/Footer'; 
import missionImage from '../images/mission.jpg';
import offerImage from '../images/join.webp'; 
import CiniImage from '../images/cinipop.webp';

const About = () => {
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#F5F5F5] p-6 font-poppins">
      <h1 className="text-4xl font-playfair font-bold mb-12 text-center text-[#C8A951] tracking-wide flex items-center justify-center animate-fadeIn" style={{textShadow: '0 0 10px rgba(200, 169, 81, 0.3)'}}>
        <FontAwesomeIcon icon={faFilm} className="mr-3 text-[#C8A951]" style={{filter: 'drop-shadow(0 0 5px rgba(200, 169, 81, 0.4))'}} />
        About Us
      </h1>

      {/* Mission Section with Image and Overlay */}
      <div className="max-w-3xl mx-auto bg-[#0D0D0D] border border-[#C8A951]/20 shadow-lg p-6 mb-12 animate-slideInLeft relative overflow-hidden hover:scale-105 transform transition duration-500" style={{boxShadow: '0 0 20px rgba(0, 0, 0, 0.5), 0 0 10px rgba(200, 169, 81, 0.2)'}}>
        <div className="relative w-full h-80 max-h-80 overflow-hidden">
          <img 
            src={missionImage} 
            alt="Our Mission" 
            className="w-full h-full object-cover opacity-90 transform transition-transform duration-500 hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
        </div>
        <div className="relative z-10 mt-6">
          <h2 className="text-2xl font-cinzel font-semibold mb-4 text-[#C8A951] animate-fadeIn" style={{textShadow: '0 0 8px rgba(200, 169, 81, 0.3)'}}>Our Mission</h2>
          <p className="mb-4 animate-fadeIn delay-200 text-[#F5F5F5] leading-relaxed font-poppins">
            At Cinematic Popcorn Park, we aim to provide an unforgettable movie experience for all. Our platform allows users to easily book tickets for the latest films while offering convenient parking solutions, ensuring that your movie night is hassle-free.
          </p>
        </div>
      </div>

      {/* What We Offer Section with Image and Overlay */}
      <div className="max-w-3xl mx-auto bg-[#0D0D0D] border border-[#C8A951]/20 shadow-lg p-6 mb-12 animate-slideInLeft relative overflow-hidden hover:scale-105 transform transition duration-500" style={{boxShadow: '0 0 20px rgba(0, 0, 0, 0.5), 0 0 10px rgba(200, 169, 81, 0.2)'}}>
        <div className="relative w-full h-80 max-h-80 overflow-hidden">
          <img 
            src={CiniImage} 
            alt="What We Offer" 
            className="w-full h-full object-cover opacity-90 transform transition-transform duration-500 hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
        </div>
        <div className="relative z-10 mt-6">
          <h2 className="text-2xl font-cinzel font-semibold mb-6 text-[#C8A951] animate-fadeIn delay-400" style={{textShadow: '0 0 8px rgba(200, 169, 81, 0.3)'}}>Premium Experiences</h2>
          <ul className="space-y-4 mb-4 animate-fadeIn delay-500 text-[#F5F5F5] font-poppins">
            <li className="flex items-center gap-3 hover:text-[#C8A951] transform transition duration-300 hover:translate-x-2 border-l-2 border-transparent hover:border-[#C8A951] pl-2">
              <FontAwesomeIcon icon={faTicketAlt} className="text-[#E50914]" style={{filter: 'drop-shadow(0 0 3px rgba(229, 9, 20, 0.5))'}} />
              Easy and quick ticket booking for all major films.
            </li>
            <li className="flex items-center gap-3 hover:text-[#C8A951] transform transition duration-300 hover:translate-x-2 border-l-2 border-transparent hover:border-[#C8A951] pl-2">
              <FontAwesomeIcon icon={faUsers} className="text-[#E50914]" style={{filter: 'drop-shadow(0 0 3px rgba(229, 9, 20, 0.5))'}} />
              A user-friendly interface to manage your bookings seamlessly.
            </li>
            <li className="flex items-center gap-3 hover:text-[#C8A951] transform transition duration-300 hover:translate-x-2 border-l-2 border-transparent hover:border-[#C8A951] pl-2">
              <FontAwesomeIcon icon={faFilm} className="text-[#E50914]" style={{filter: 'drop-shadow(0 0 3px rgba(229, 9, 20, 0.5))'}} />
              Up-to-date information on the latest releases, trailers, and more.
            </li>
          </ul>
        </div>
      </div>

      {/* Join Us Section with Image and Overlay */}
      <div className="max-w-3xl mx-auto bg-[#0D0D0D] border border-[#C8A951]/20 shadow-lg p-6 mb-12 animate-slideInLeft relative overflow-hidden hover:scale-105 transform transition duration-500" style={{boxShadow: '0 0 20px rgba(0, 0, 0, 0.5), 0 0 10px rgba(200, 169, 81, 0.2)'}}>
        <div className="relative w-full h-80 max-h-80 overflow-hidden">
          <img 
            src={offerImage} 
            alt="Join Us" 
            className="w-full h-full object-cover opacity-90 transform transition-transform duration-500 hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
        </div>
        <div className="relative z-10 mt-6">
          <h2 className="text-2xl font-cinzel font-semibold mb-4 text-[#C8A951] animate-fadeIn delay-600" style={{textShadow: '0 0 8px rgba(200, 169, 81, 0.3)'}}>Join Our Experience</h2>
          <p className="animate-fadeIn delay-700 text-[#F5F5F5] leading-relaxed font-poppins">
            We invite movie lovers everywhere to join us on this journey. Whether you're planning a night out with friends or a family outing, Cinematic Popcorn Park is here to enhance your cinematic experience. Book your tickets now and let the magic of movies unfold!
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;
