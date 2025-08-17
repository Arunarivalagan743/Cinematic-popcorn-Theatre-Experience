import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOut,
} from '../redux/user/userSlice';
import { FaUser, FaEnvelope, FaLock, FaTrashAlt, FaSignOutAlt } from 'react-icons/fa';

export default function Profile() {
  const dispatch = useDispatch();
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    username: currentUser.username || '',
    email: currentUser.email || '',
    password: '',
  });

  useEffect(() => {
    setUpdateSuccess(false); 
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`https://cinematic-popcorn-theatre-experience-2.onrender.com/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error));
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (!confirmDelete) return;

    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error));
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/signout');
      dispatch(signOut());
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mt-24 p-8 max-w-lg mx-auto relative overflow-hidden">
      <div className="absolute inset-0 bg-[#0D0D0D] opacity-95 transform transition duration-500 animate-fadeIn"></div>
      <div className="relative z-10 p-8 bg-[#0D0D0D] border border-[#C8A951]/30 shadow-lg transform transition duration-300 hover:scale-102" style={{boxShadow: '0 0 25px rgba(0, 0, 0, 0.7), 0 0 15px rgba(200, 169, 81, 0.2)'}}>
        <h1 className="text-3xl font-playfair font-semibold text-center my-6 text-[#C8A951]" style={{textShadow: '0 0 10px rgba(200, 169, 81, 0.3)'}}>Profile</h1>
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <img
            src={currentUser.profilePicture || 'default-profile.png'}
            alt="profile"
            className="h-24 w-24 self-center cursor-pointer object-cover mt-2 border-2 border-[#C8A951] shadow-md transition-transform duration-300 hover:scale-105"
            style={{boxShadow: '0 0 15px rgba(200, 169, 81, 0.3)'}}
          />
          <div className="flex items-center border-b border-[#C8A951]/30 focus-within:border-[#C8A951] transition duration-300 pb-1">
            <FaUser className="text-[#C8A951] mr-3" style={{filter: 'drop-shadow(0 0 3px rgba(200, 169, 81, 0.3))'}} />
            <input
              type="text"
              id="username"
              placeholder="Username"
              className="bg-[#0D0D0D] p-3 w-full focus:outline-none transition duration-300 text-[#F5F5F5] font-poppins"
              style={{boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.3)'}}
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center border-b border-[#C8A951]/30 focus-within:border-[#C8A951] transition duration-300 pb-1">
            <FaEnvelope className="text-[#C8A951] mr-3" style={{filter: 'drop-shadow(0 0 3px rgba(200, 169, 81, 0.3))'}} />
            <input
              type="email"
              id="email"
              placeholder="Email"
              className="bg-[#0D0D0D] p-3 w-full focus:outline-none transition duration-300 text-[#F5F5F5] font-poppins"
              style={{boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.3)'}}
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center border-b border-[#C8A951]/30 focus-within:border-[#C8A951] transition duration-300 pb-1">
            <FaLock className="text-[#C8A951] mr-3" style={{filter: 'drop-shadow(0 0 3px rgba(200, 169, 81, 0.3))'}} />
            <input
              type="password"
              id="password"
              placeholder="Password"
              className="bg-[#0D0D0D] p-3 w-full focus:outline-none transition duration-300 text-[#F5F5F5] font-poppins"
              style={{boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.3)'}}
              onChange={handleChange}
            />
          </div>
          <button className="bg-[#0D0D0D] border border-[#C8A951] text-[#F5F5F5] py-3 uppercase font-cinzel transition-all duration-300 hover:shadow-lg mt-4" 
            style={{boxShadow: '0 0 10px rgba(200, 169, 81, 0.2)'}}>
            {loading ? 'Loading...' : 'Update Profile'}
          </button>
        </form>
        <div className="flex justify-end mt-8">
          <span
            onClick={handleSignOut}
            className="flex items-center text-[#C8A951] cursor-pointer hover:text-[#E50914] transition duration-300 border-b border-transparent hover:border-[#E50914] pb-1 font-poppins"
          >
            <FaSignOutAlt className="mr-2" style={{filter: 'drop-shadow(0 0 3px rgba(200, 169, 81, 0.3))'}} />
            Sign out
          </span>
        </div>
        <p className="text-[#E50914] mt-5 font-poppins">{error && 'Something went wrong!'}</p>
        <p className="text-[#C8A951] mt-5 font-poppins">{updateSuccess && 'Profile updated successfully!'}</p>
      </div>
    </div>
  );
}
