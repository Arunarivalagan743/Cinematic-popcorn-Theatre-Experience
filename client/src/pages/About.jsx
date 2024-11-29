// import React from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faFilm, faTicketAlt, faUsers } from '@fortawesome/free-solid-svg-icons';
// import Footer from '../components/Footer'; 
// import missionImage from '../images/mission.jpg';
// import offerImage from '../images/join.webp';import CiniImage from '../images/cinipop.webp';

// const About = () => {
//   return (
//     <div className="min-h-screen bg-gradient-to-br text-white p-4">
//       <h1 className="text-4xl font-bold mb-8 text-center text-yellow-500 tracking-wide flex items-center justify-center animate-fadeInDown">
//         <FontAwesomeIcon icon={faFilm} className="mr-2 text-yellow-300 animate-bounce" />
//         About Us
//       </h1>
      
//       {/* Mission Section with Image and Overlay */}
//       <div className="max-w-3xl mx-auto bg-gray-900 bg-opacity-70 rounded-lg shadow-lg p-6 mb-10 animate-slideInLeft relative overflow-hidden">
//         <div className="relative w-full h-80 max-h-80 rounded-lg overflow-hidden">
//           <img 
//             src={missionImage} 
//             alt="Our Mission" 
//             className="w-full h-full object-cover opacity-80 transform transition-transform duration-500 hover:scale-105"
//           />
//           <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60 rounded-lg"></div>
//         </div>
//         <div className="relative z-10 mt-4">
//           <h2 className="text-2xl font-semibold mb-4 text-yellow-400 animate-fadeIn">Our Mission</h2>
//           <p className="mb-4 animate-fadeIn delay-200">
//             At Cinematic Popcorn Park, we aim to provide an unforgettable movie experience for all. Our platform allows users to easily book tickets for the latest films while offering convenient parking solutions, ensuring that your movie night is hassle-free.
//           </p>
//         </div>
//       </div>

//       {/* What We Offer Section with Image and Overlay */}
//       <div className="max-w-3xl mx-auto bg-gray-900 bg-opacity-70 rounded-lg shadow-lg p-6 mb-10 animate-slideInLeft relative overflow-hidden">
//         <div className="relative w-full h-80 max-h-80 rounded-lg overflow-hidden">
//           <img 
//             src={CiniImage} 
//             alt="What We Offer" 
//             className="w-full h-full object-cover opacity-80 transform transition-transform duration-500 hover:scale-105"
//           />
//           <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60 rounded-lg"></div>
//         </div>
//         <div className="relative z-10 mt-4">
//           <h2 className="text-2xl font-semibold mb-4 text-yellow-400 animate-fadeIn delay-400">What We Offer</h2>
//           <ul className="list-disc list-inside mb-4 animate-fadeIn delay-500">
//             <li className="flex items-center gap-2">
//               <FontAwesomeIcon icon={faTicketAlt} className="text-yellow-300 animate-pulse" />
//               Easy and quick ticket booking for all major films.
//             </li>
//             <li className="flex items-center gap-2">
//               <FontAwesomeIcon icon={faUsers} className="text-yellow-300 animate-pulse" />
//               A user-friendly interface to manage your bookings seamlessly.
//             </li>
//             <li className="flex items-center gap-2">
//               <FontAwesomeIcon icon={faFilm} className="text-yellow-300 animate-pulse" />
//               Up-to-date information on the latest releases, trailers, and more.
//             </li>
//           </ul>
//         </div>
//       </div>

//       {/* Join Us Section with Image and Overlay */}
//       <div className="max-w-3xl mx-auto bg-gray-900 bg-opacity-70 rounded-lg shadow-lg p-6 mb-10 animate-slideInLeft relative overflow-hidden">
//         <div className="relative w-full h-80 max-h-80 rounded-lg overflow-hidden">
//           <img 
//             src={offerImage} 
//             alt="Join Us" 
//             className="w-full h-full object-cover opacity-80 transform transition-transform duration-500 hover:scale-105"
//           />
//           <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60 rounded-lg"></div>
//         </div>
//         <div className="relative z-10 mt-4">
//           <h2 className="text-2xl font-semibold mb-4 text-yellow-400 animate-fadeIn delay-600">Join Us</h2>
//           <p className="animate-fadeIn delay-700">
//             We invite movie lovers everywhere to join us on this journey. Whether you're planning a night out with friends or a family outing, Cinematic Popcorn Park is here to enhance your cinematic experience. Book your tickets now and let the magic of movies unfold!
//           </p>
//         </div>
//       </div>

//       <Footer />
//     </div>
//   );
// };

// export default About;
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilm, faTicketAlt, faUsers } from '@fortawesome/free-solid-svg-icons';
import Footer from '../components/Footer'; 
import missionImage from '../images/mission.jpg';
import offerImage from '../images/join.webp'; 
import CiniImage from '../images/cinipop.webp';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-100 to-blue-200 text-gray-800 p-6">
      <h1 className="text-4xl font-bold mb-8 text-center text-yellow-500 tracking-wide flex items-center justify-center animate-fadeIn">
        <FontAwesomeIcon icon={faFilm} className="mr-2 text-yellow-300 animate-bounce" />
        About Us
      </h1>

      {/* Mission Section with Image and Overlay */}
      <div className="max-w-3xl mx-auto bg-white bg-opacity-90 rounded-lg shadow-lg p-6 mb-10 animate-slideInLeft relative overflow-hidden hover:scale-105 transform transition duration-500 hover:rotate-3d">
        <div className="relative w-full h-80 max-h-80 rounded-lg overflow-hidden">
          <img 
            src={missionImage} 
            alt="Our Mission" 
            className="w-full h-full object-cover opacity-80 transform transition-transform duration-500 hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60 rounded-lg"></div>
        </div>
        <div className="relative z-10 mt-4">
          <h2 className="text-2xl font-semibold mb-4 text-yellow-400 animate-fadeIn">Our Mission</h2>
          <p className="mb-4 animate-fadeIn delay-200">
            At Cinematic Popcorn Park, we aim to provide an unforgettable movie experience for all. Our platform allows users to easily book tickets for the latest films while offering convenient parking solutions, ensuring that your movie night is hassle-free.
          </p>
        </div>
      </div>

      {/* What We Offer Section with Image and Overlay */}
      <div className="max-w-3xl mx-auto bg-white bg-opacity-90 rounded-lg shadow-lg p-6 mb-10 animate-slideInLeft relative overflow-hidden hover:scale-105 transform transition duration-500 hover:rotate-3d">
        <div className="relative w-full h-80 max-h-80 rounded-lg overflow-hidden">
          <img 
            src={CiniImage} 
            alt="What We Offer" 
            className="w-full h-full object-cover opacity-80 transform transition-transform duration-500 hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60 rounded-lg"></div>
        </div>
        <div className="relative z-10 mt-4">
          <h2 className="text-2xl font-semibold mb-4 text-yellow-400 animate-fadeIn delay-400">What We Offer</h2>
          <ul className="list-disc list-inside mb-4 animate-fadeIn delay-500">
            <li className="flex items-center gap-2 hover:text-yellow-400 transform transition duration-300 hover:scale-110">
              <FontAwesomeIcon icon={faTicketAlt} className="text-yellow-300 animate-pulse" />
              Easy and quick ticket booking for all major films.
            </li>
            <li className="flex items-center gap-2 hover:text-yellow-400 transform transition duration-300 hover:scale-110">
              <FontAwesomeIcon icon={faUsers} className="text-yellow-300 animate-pulse" />
              A user-friendly interface to manage your bookings seamlessly.
            </li>
            <li className="flex items-center gap-2 hover:text-yellow-400 transform transition duration-300 hover:scale-110">
              <FontAwesomeIcon icon={faFilm} className="text-yellow-300 animate-pulse" />
              Up-to-date information on the latest releases, trailers, and more.
            </li>
          </ul>
        </div>
      </div>

      {/* Join Us Section with Image and Overlay */}
      <div className="max-w-3xl mx-auto bg-white bg-opacity-90 rounded-lg shadow-lg p-6 mb-10 animate-slideInLeft relative overflow-hidden hover:scale-105 transform transition duration-500 hover:rotate-3d">
        <div className="relative w-full h-80 max-h-80 rounded-lg overflow-hidden">
          <img 
            src={offerImage} 
            alt="Join Us" 
            className="w-full h-full object-cover opacity-80 transform transition-transform duration-500 hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60 rounded-lg"></div>
        </div>
        <div className="relative z-10 mt-4">
          <h2 className="text-2xl font-semibold mb-4 text-yellow-400 animate-fadeIn delay-600">Join Us</h2>
          <p className="animate-fadeIn delay-700">
            We invite movie lovers everywhere to join us on this journey. Whether you're planning a night out with friends or a family outing, Cinematic Popcorn Park is here to enhance your cinematic experience. Book your tickets now and let the magic of movies unfold!
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;
