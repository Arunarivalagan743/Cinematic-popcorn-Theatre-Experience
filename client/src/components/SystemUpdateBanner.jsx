import React from 'react';
import { Link } from 'react-router-dom';

const SystemUpdateBanner = () => {
  return (
    <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white p-4 mb-6 rounded-md shadow-lg">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-3 md:mb-0">
            <div className="mr-3 bg-blue-500 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-lg">System Update</h3>
              <p className="text-blue-100 text-sm">We've upgraded our booking system for better reliability.</p>
            </div>
          </div>
          <Link to="/" className="bg-blue-500 hover:bg-blue-600 transition-colors duration-300 text-white font-bold py-2 px-4 rounded-full flex items-center justify-center">
            <span>Try New System</span>
            <div className="w-2 h-2 ml-2 rounded-full bg-green-400 animate-pulse"></div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SystemUpdateBanner;
