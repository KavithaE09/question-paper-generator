// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCbdnWDKU_oyCZDxogd-XPN1bZOvc564k0",
  authDomain: "question-paper-97e6b.firebaseapp.com",
  projectId: "question-paper-97e6b",
  storageBucket: "question-paper-97e6b.firebasestorage.app",
  messagingSenderId: "51846562198",
  appId: "1:51846562198:web:7706a880da586005d19db7",
  measurementId: "G-TRCB4C4K9R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Optional: Initialize Analytics (only if you want to use it)
export const analytics = getAnalytics(app);