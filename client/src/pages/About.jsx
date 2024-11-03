import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilm, faTicketAlt, faUsers } from '@fortawesome/free-solid-svg-icons';
import Footer from '../components/Footer'; 

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-purple-800 text-white p-4">
      <h1 className="text-4xl font-bold mb-8 text-center text-yellow-500 tracking-wide flex items-center justify-center">
        <FontAwesomeIcon icon={faFilm} className="mr-2 text-yellow-300" />
        About Us
      </h1>
      <div className="max-w-3xl mx-auto bg-gray-900 bg-opacity-70 rounded-lg shadow-lg p-6 mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-yellow-400">Our Mission</h2>
        <p className="mb-4">
          At Cinematic Popcorn Park, we aim to provide an unforgettable movie experience for all. Our platform allows users to easily book tickets for the latest films while offering convenient parking solutions, ensuring that your movie night is hassle-free.
        </p>
        <h2 className="text-2xl font-semibold mb-4 text-yellow-400">What We Offer</h2>
        <ul className="list-disc list-inside mb-4">
          <li className="flex items-center gap-2">
            <FontAwesomeIcon icon={faTicketAlt} className="text-yellow-300" />
            Easy and quick ticket booking for all major films.
          </li>
          <li className="flex items-center gap-2">
            <FontAwesomeIcon icon={faUsers} className="text-yellow-300" />
            A user-friendly interface to manage your bookings seamlessly.
          </li>
          <li className="flex items-center gap-2">
            <FontAwesomeIcon icon={faFilm} className="text-yellow-300" />
            Up-to-date information on the latest releases, trailers, and more.
          </li>
        </ul>
        <h2 className="text-2xl font-semibold mb-4 text-yellow-400">Join Us</h2>
        <p>
          We invite movie lovers everywhere to join us on this journey. Whether you're planning a night out with friends or a family outing, Cinematic Popcorn Park is here to enhance your cinematic experience. Book your tickets now and let the magic of movies unfold!
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default About;
