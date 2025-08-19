
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import AdminPrivateRoute from './components/AdminPrivateRoute';
import DebugPage from './pages/DebugPage';

import TicketsNew from './pages/Tickets-new';
import Faq from './pages/Faq';
import Contact from './pages/Contact';
import Pricing from './pages/Pricing';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import CancellationRefund from './pages/CancellationRefund';

import PaymentNew from './pages/payment-new';
import { useEffect } from 'react';
import { connectSocket, disconnectSocket } from './services/socketService';

// Admin Components
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import MovieManagement from './pages/admin/MovieManagement';
import BookingManagement from './pages/admin/BookingManagement';
import Reports from './pages/admin/Reports';

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
          <Route path='/debug' element={<DebugPage />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/pricing' element={<Pricing />} />
          <Route path='/privacy-policy' element={<PrivacyPolicy />} />
          <Route path='/terms-conditions' element={<TermsConditions />} />
          <Route path='/cancellation-refund' element={<CancellationRefund />} />
          
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

          {/* Admin Routes */}
          <Route path='/admin/dashboard' element={
            <AdminPrivateRoute>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </AdminPrivateRoute>
          } />
          <Route path='/admin/users' element={
            <AdminPrivateRoute>
              <AdminLayout>
                <UserManagement />
              </AdminLayout>
            </AdminPrivateRoute>
          } />
          <Route path='/admin/movies' element={
            <AdminPrivateRoute>
              <AdminLayout>
                <MovieManagement />
              </AdminLayout>
            </AdminPrivateRoute>
          } />
          <Route path='/admin/bookings' element={
            <AdminPrivateRoute>
              <AdminLayout>
                <BookingManagement />
              </AdminLayout>
            </AdminPrivateRoute>
          } />
          <Route path='/admin/reports' element={
            <AdminPrivateRoute>
              <AdminLayout>
                <Reports />
              </AdminLayout>
            </AdminPrivateRoute>
          } />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
