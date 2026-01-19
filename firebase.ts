// Firebase configuration using CDN (compat mode)
declare const firebase: any;

const firebaseConfig = {
  apiKey: "AIzaSyBLZ3yJxHT8qLEfXgMPVNGvHQi6DvbRpwQ",
  authDomain: "ripped-city-coaching.firebaseapp.com",
  projectId: "ripped-city-coaching",
  storageBucket: "ripped-city-coaching.firebasestorage.app",
  messagingSenderId: "1027732918817",
  appId: "1:1027732918817:web:e4c6f0f4c4e4f0f4e4f0f4"
};

// Initialize Firebase using CDN
if (typeof firebase !== 'undefined' && !firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Export Firebase services
export const auth = typeof firebase !== 'undefined' ? firebase.auth() : null;
export const db = typeof firebase !== 'undefined' ? firebase.firestore() : null;
export const storage = typeof firebase !== 'undefined' ? firebase.storage() : null;
export const app = typeof firebase !== 'undefined' ? firebase.app() : null;
