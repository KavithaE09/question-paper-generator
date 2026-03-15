// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

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

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Configure Google Provider
export const googleProvider = new GoogleAuthProvider();

// College domain restriction
googleProvider.setCustomParameters({
  hd: 'francisxavier.ac.in', // Only suggest this domain
  prompt: 'select_account' // Always show account picker
});

export default app;