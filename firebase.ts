import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBLZ3yJxHT8qLEfXgMPVNGvHQi6DvbRpwQ",
  authDomain: "ripped-city-coaching.firebaseapp.com",
  projectId: "ripped-city-coaching",
  storageBucket: "ripped-city-coaching.firebasestorage.app",
  messagingSenderId: "1027732918817",
  appId: "1:1027732918817:web:e4c6f0f4c4e4f0f4e4f0f4"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
