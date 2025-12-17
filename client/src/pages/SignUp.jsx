
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock} from 'react-icons/fa'; // Importing icons
import OAuth from '../components/OAuth';

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      // Basic client-side validation
      if (!formData.username || !formData.email || !formData.password) {
        setError('All fields are required');
        setLoading(false);
        return;
      }
      
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long');
        setLoading(false);
        return;
      }
      
    const res = await fetch('https://cinematic-popcorn-theatre-experience-3.onrender.com/api/auth/signup', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include', // ✅ Add this line
  body: JSON.stringify(formData),
});

      const data = await res.json();
      setLoading(false);
      
      if (data.success === false || !res.ok) {
        setError(data.message || 'Registration failed');
        return;
      }
      
      // Success - redirect to sign in
      navigate('/sign-in');
    } catch (error) {
      setLoading(false);
      setError('Network error. Please try again.');
      console.error('Signup error:', error);
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto bg-[#0D0D0D] border border-[#C8A951]/30 shadow-xl mt-20 transform transition-all hover:shadow-2xl duration-300" style={{boxShadow: '0 0 25px rgba(0, 0, 0, 0.7), 0 0 15px rgba(200, 169, 81, 0.2)'}}>
      <h1 className="text-4xl text-center font-playfair font-bold text-[#C8A951] my-6 tracking-wide animate-fadeIn" style={{textShadow: '0 0 10px rgba(200, 169, 81, 0.3)'}}>
        Register
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="relative group">
          <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#C8A951] transition-all duration-300 group-hover:scale-110" style={{filter: 'drop-shadow(0 0 3px rgba(200, 169, 81, 0.3))'}} />
          <input
            type="text"
            placeholder="Username"
            id="username"
            className="bg-[#0D0D0D] pl-12 p-3 w-full border border-[#C8A951]/30 text-[#F5F5F5] focus:outline-none focus:border-[#C8A951] transition duration-300 font-poppins"
            style={{boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.3)'}}
            onChange={handleChange}
          />
        </div>
        <div className="relative group">
          <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#C8A951] transition-all duration-300 group-hover:scale-110" style={{filter: 'drop-shadow(0 0 3px rgba(200, 169, 81, 0.3))'}} />
          <input
            type="email"
            placeholder="Email"
            id="email"
            className="bg-[#0D0D0D] pl-12 p-3 w-full border border-[#C8A951]/30 text-[#F5F5F5] focus:outline-none focus:border-[#C8A951] transition duration-300 font-poppins"
            style={{boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.3)'}}
            onChange={handleChange}
          />
        </div>
        <div className="relative group">
          <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#C8A951] transition-all duration-300 group-hover:scale-110" style={{filter: 'drop-shadow(0 0 3px rgba(200, 169, 81, 0.3))'}} />
          <input
            type="password"
            placeholder="Password"
            id="password"
            className="bg-[#0D0D0D] pl-12 p-3 w-full border border-[#C8A951]/30 text-[#F5F5F5] focus:outline-none focus:border-[#C8A951] transition duration-300 font-poppins"
            style={{boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.3)'}}
            onChange={handleChange}
          />
        </div>
        <button
          disabled={loading}
          className="bg-[#0D0D0D] border border-[#C8A951] text-[#F5F5F5] font-cinzel font-semibold p-3 uppercase tracking-wide transition-all duration-300 hover:shadow-lg disabled:opacity-80 mt-2"
          style={{boxShadow: '0 0 10px rgba(200, 169, 81, 0.2)'}}
        >
          {loading ? 'Loading...' : 'Sign Up'}
        </button>
        <div className="flex items-center gap-3">
          <OAuth />
        </div>
      </form>
      <div className="flex gap-2 mt-6 justify-center text-sm text-[#F5F5F5] font-poppins">
        <p>Have an account?</p>
        <Link to="/sign-in" className="text-[#C8A951] hover:text-[#E50914] transition-colors duration-300 border-b border-transparent hover:border-[#E50914]">
          Sign in
        </Link>
      </div>
      {error && (
        <p className="text-[#E50914] mt-4 text-center font-poppins">
          {error}
        </p>
      )}
    </div>
  );
}
