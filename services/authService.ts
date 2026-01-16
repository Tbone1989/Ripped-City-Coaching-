// Authentication service using Firebase Auth
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../firebase';

export interface UserProfile {
  uid: string;
  email: string;
  role: 'coach' | 'client';
  displayName?: string;
  photoURL?: string;
  createdAt: string;
}

// Sign up with email and password
export const signUpWithEmail = async (
  email: string,
  password: string,
  role: 'coach' | 'client' = 'client'
): Promise<User> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Create user profile in Firestore
  await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid,
    email: user.email,
    role,
    displayName: user.displayName || email.split('@')[0],
    photoURL: user.photoURL || '',
    createdAt: new Date().toISOString()
  });

  return user;
};

// Sign in with email and password
export const signInWithEmail = async (
  email: string,
  password: string
): Promise<User> => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

// Sign in with Google
export const signInWithGoogle = async (): Promise<User> => {
  const userCredential = await signInWithPopup(auth, googleProvider);
  const user = userCredential.user;

  // Check if user profile exists, if not create one
  const userDoc = await getDoc(doc(db, 'users', user.uid));
  if (!userDoc.exists()) {
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      role: 'client', // Default role for new Google sign-ins
      displayName: user.displayName || user.email?.split('@')[0],
      photoURL: user.photoURL || '',
      createdAt: new Date().toISOString()
    });
  }

  return user;
};

// Sign out
export const logOut = async (): Promise<void> => {
  await signOut(auth);
};

// Get user profile from Firestore
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const userDoc = await getDoc(doc(db, 'users', uid));
  if (userDoc.exists()) {
    return userDoc.data() as UserProfile;
  }
  return null;
};

// Listen to auth state changes
export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Check if user is coach
export const isCoach = async (uid: string): Promise<boolean> => {
  const profile = await getUserProfile(uid);
  return profile?.role === 'coach';
};
