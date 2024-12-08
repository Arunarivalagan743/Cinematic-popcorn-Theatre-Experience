// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-auth-movie-clienttt.onrender.com
",
  projectId: "mern-auth-12b18",
  storageBucket: "mern-auth-12b18.appspot.com",
  messagingSenderId: "791686812184",
  appId: "1:791686812184:web:6157adac74323b80c4e96d"
};

// Initialize Firebase
 export const app = initializeApp(firebaseConfig);
