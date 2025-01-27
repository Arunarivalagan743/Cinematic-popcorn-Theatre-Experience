
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaEnvelope, FaLock } from 'react-icons/fa'; // Importing icons for inputs and Google
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../redux/user/userSlice';
import OAuth from '../components/OAuth';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch('https://mern-auth-movie.onrender.com/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data));
        return;
      }
      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      dispatch(signInFailure(error));
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto bg-gradient-to-b from-gray-100 to-white rounded-lg shadow-xl mt-20 transform transition-all hover:shadow-2xl duration-300">
      <h1 className="text-4xl text-center font-bold text-purple-600 my-5 tracking-wide animate-fadeIn">
        Sign In
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="relative group">
          <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-500 transition-transform duration-300 group-hover:scale-125" />
          <input
            type="email"
            placeholder="Email"
            id="email"
            className="bg-gray-50 pl-12 p-3 w-full rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
            onChange={handleChange}
          />
        </div>
        <div className="relative group">
          <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-500 transition-transform duration-300 group-hover:scale-125" />
          <input
            type="password"
            placeholder="Password"
            id="password"
            className="bg-gray-50 pl-12 p-3 w-full rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
            onChange={handleChange}
          />
        </div>
        <button
          disabled={loading}
          className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold p-3 rounded-lg shadow-md uppercase tracking-wide hover:from-purple-600 hover:to-indigo-600 transition duration-300 transform hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-80"
        >
          {loading ? 'Loading...' : 'Sign In'}
        </button>
        <div className="flex items-center gap-3">
        
         
          <OAuth />
        </div>
      </form>
      <div className="flex gap-2 mt-6 justify-center text-sm text-gray-700">
        <p>Don't have an account?</p>
        <Link to="/sign-up" className="text-purple-700 hover:underline">
          Sign up
        </Link>
      </div>
      {error && (
        <p className="text-red-600 mt-4 text-center animate-bounce">
          {error.message || 'Something went wrong!'}
        </p>
      )}
    </div>
  );
}