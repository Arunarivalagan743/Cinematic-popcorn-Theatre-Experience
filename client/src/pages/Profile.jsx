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
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
    const confirmDelete = window.confirm("Are you sure you want to delete your account?");
    if (!confirmDelete) return;

    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
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
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 opacity-80 transform transition duration-500 animate-fadeIn"></div>
      <div className="relative z-10 p-8 rounded-lg shadow-lg bg-white bg-opacity-90 backdrop-filter backdrop-blur-md transform transition duration-300 hover:scale-105">
        <h1 className="text-3xl font-semibold text-center my-5 text-purple-700">Profile</h1>
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <img
            src={currentUser.profilePicture || 'default-profile.png'}
            alt="profile"
            className="h-24 w-24 self-center cursor-pointer rounded-full object-cover mt-2 border-4 border-purple-500 shadow-sm transition-transform duration-300 hover:scale-110"
          />
          <div className="flex items-center border-b-2 border-gray-300 focus-within:border-purple-500 transition duration-300">
            <FaUser className="text-gray-500 mr-2" />
            <input
              type="text"
              id="username"
              placeholder="Username"
              className="bg-gray-100 bg-opacity-90 p-3 w-full focus:outline-none transition duration-300 hover:bg-opacity-100"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center border-b-2 border-gray-300 focus-within:border-purple-500 transition duration-300">
            <FaEnvelope className="text-gray-500 mr-2" />
            <input
              type="email"
              id="email"
              placeholder="Email"
              className="bg-gray-100 bg-opacity-90 p-3 w-full focus:outline-none transition duration-300 hover:bg-opacity-100"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center border-b-2 border-gray-300 focus-within:border-purple-500 transition duration-300">
            <FaLock className="text-gray-500 mr-2" />
            <input
              type="password"
              id="password"
              placeholder="Password"
              className="bg-gray-100 bg-opacity-90 p-3 w-full focus:outline-none transition duration-300 hover:bg-opacity-100"
              onChange={handleChange}
            />
          </div>
          <button className="bg-purple-600 text-white py-3 rounded-lg uppercase hover:bg-purple-700 transition duration-300">
            {loading ? 'Loading...' : 'Update'}
          </button>
        </form>
        <div className="flex justify-between mt-6">
         
          <span
            onClick={handleSignOut}
            className="flex items-center text-purple-700 cursor-pointer hover:text-purple-500 transition duration-300"
          >
            <FaSignOutAlt className="mr-1" />
            Sign out
          </span>
        </div>
        <p className="text-red-600 mt-5">{error && 'Something went wrong!'}</p>
        <p className="text-green-600 mt-5">{updateSuccess && 'Profile updated successfully!'}</p>
      </div>
    </div>
  );
}
