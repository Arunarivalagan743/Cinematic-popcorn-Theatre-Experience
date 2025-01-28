
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock} from 'react-icons/fa'; // Importing icons
import OAuth from '../components/OAuth';

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(false);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(true);
        return;
      }
      navigate('/sign-in');
    } catch (error) {
      setLoading(false);
      setError(true);
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto bg-gradient-to-b from-gray-100 to-white rounded-lg shadow-xl mt-20 transform transition-all hover:shadow-2xl duration-300">
      <h1 className="text-4xl text-center font-bold text-purple-600 my-5 tracking-wide animate-fadeIn">
        Register
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="relative group">
          <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-500 transition-transform duration-300 group-hover:scale-125" />
          <input
            type="text"
            placeholder="Username"
            id="username"
            className="bg-gray-50 pl-12 p-3 w-full rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
            onChange={handleChange}
          />
        </div>
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
          {loading ? 'Loading...' : 'Sign Up'}
        </button>
        <div className="flex items-center gap-3">
      
          <OAuth />
        </div>
      </form>
      <div className="flex gap-2 mt-6 justify-center text-sm text-gray-700">
        <p>Have an account?</p>
        <Link to="/sign-in" className="text-purple-700 hover:underline">
          Sign in
        </Link>
      </div>
      {error && (
        <p className="text-red-600 mt-4 text-center animate-bounce">
          Something went wrong!
        </p>
      )}
    </div>
  );
}
