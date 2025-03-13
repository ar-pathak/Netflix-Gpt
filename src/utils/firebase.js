// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAjJQZD89FjUIhBtf6UpNsgHie4Xwp5PY4",
  authDomain: "netflix-gpt-697e6.firebaseapp.com",
  projectId: "netflix-gpt-697e6",
  storageBucket: "netflix-gpt-697e6.firebasestorage.app",
  messagingSenderId: "15255415806",
  appId: "1:15255415806:web:31707861eb2c7be88baeaf",
  measurementId: "G-3LN12WTSXL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { auth };