import React from 'react';
import { useSelector } from 'react-redux';

export default function DebugPage() {
  const { currentUser } = useSelector((state) => state.user);

  const clearStorage = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="p-8 bg-gray-900 text-white min-h-screen">
      <h1 className="text-2xl mb-4">Debug Information</h1>
      
      <div className="mb-4">
        <h2 className="text-xl mb-2">Current User from Redux:</h2>
        <pre className="bg-gray-800 p-4 rounded">
          {JSON.stringify(currentUser, null, 2)}
        </pre>
      </div>
      
      <div className="mb-4">
        <h2 className="text-xl mb-2">LocalStorage:</h2>
        <pre className="bg-gray-800 p-4 rounded">
          {JSON.stringify(localStorage, null, 2)}
        </pre>
      </div>
      
      <div className="mb-4">
        <h2 className="text-xl mb-2">Cookies:</h2>
        <pre className="bg-gray-800 p-4 rounded">
          {document.cookie}
        </pre>
      </div>
      
      <button 
        onClick={clearStorage}
        className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
      >
        Clear Storage & Reload
      </button>
    </div>
  );
}
