
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';

import TicketsNew from './pages/Tickets-new';
import Faq from './pages/Faq';

import PaymentNew from './pages/payment-new';
import { useEffect } from 'react';
import { connectSocket, disconnectSocket } from './services/socketService';

export default function App() {
  // Initialize and clean up socket connection
  useEffect(() => {
    // Connect to socket server on app load
    connectSocket();
    
    // Disconnect socket when app unmounts
    return () => {
      disconnectSocket();
    };
  }, []);
  
  return (
    <BrowserRouter>
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          
          {/* New real-time routes (prioritized) */}
          <Route path="/tickets/:movieId/:showtimeId" element={<TicketsNew />} />
          <Route path='/payment-new' element={<PaymentNew />} />
          
          {/* Legacy routes (fallback) */}

          
          <Route path='/faq' element={<Faq />} />
          <Route path='/sign-in' element={<SignIn />} />
          <Route path='/sign-up' element={<SignUp />} />
       
          <Route element={<PrivateRoute />}>
            <Route path='/profile' element={<Profile />} /> {/* Default to new profile */}
            <Route path='/profile-legacy' element={<Profile />} /> {/* Kept for backward compatibility */}
          </Route>
        </Routes>
      </main>
    </BrowserRouter>
  );
}
