import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });
      const data = await res.json();
      console.log(data);
      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      console.log('could not login with google', error);
    }
  };

  return (
<button
  type="button"
  onClick={handleGoogleClick}
  className="bg-gradient-to-r from-teal-400 to-blue-500 text-white font-semibold p-3 text-lg w-full max-w-md rounded-lg shadow-md uppercase tracking-wide hover:from-teal-500 hover:to-blue-600 transition duration-300 transform hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-80"
>
  Continue with Google
</button>

  );
}
