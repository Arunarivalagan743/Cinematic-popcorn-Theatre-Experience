
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import Tickets from './pages/Tickets';
import Faq from './pages/Faq';
 // Import the ParkLot component
import Payment from './pages/payment'; // Import the Payment component

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          {/* <Route path="/tickets/:movie/:screen/:timing" element={<Tickets />} /> */}
          <Route path="/tickets/:movie/:screen/:timing" element={<Tickets />} />

          <Route path='/faq' element={<Faq />} />
          <Route path='/sign-in' element={<SignIn />} />
          <Route path='/sign-up' element={<SignUp />} />
       
          <Route element={<PrivateRoute />}>
            <Route path='/profile' element={<Profile />} />
          </Route>
         
          <Route path='/payment' element={<Payment />} />
        </Routes>
      </main>
 
    </BrowserRouter>
  );
}
