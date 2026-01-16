// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCQ6OnMt39Pt6eV5bfAEBhmBBxnX5_yUoY",
  authDomain: "ripped-city-coaching.firebaseapp.com",
  projectId: "ripped-city-coaching",
  storageBucket: "ripped-city-coaching.firebasestorage.app",
  messagingSenderId: "816632878220",
  appId: "1:816632878220:web:ba47687fbde963ea517a9",
  measurementId: "G-CYPPY95J6L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
