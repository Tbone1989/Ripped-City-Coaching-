// Authentication service using Firebase CDN compat API
declare const firebase: any;

import { auth, db } from './firebase';
import { UserRole } from './types';

const COACH_SECRET_KEY = 'rc-alpha-99';
const COACH_EMAIL = 'coach@rippedcity.com';
const COACH_PASSWORD = 'RippedCity2026!';

export interface UserData {
  email: string;
  role: UserRole;
  fullName?: string;
  createdAt: string;
}

// Coach login with secret key
export const loginWithSecretKey = async (secretKey: string): Promise<{ user: any; role: UserRole } | null> => {
  if (secretKey !== COACH_SECRET_KEY) {
    throw new Error('Invalid secret key');
  }
  
  try {
    // Sign in with coach credentials using compat API
    const userCredential = await auth.signInWithEmailAndPassword(COACH_EMAIL, COACH_PASSWORD);
    return {
      user: userCredential.user,
      role: 'coach' as UserRole
    };
  } catch (error: any) {
    console.error('Coach login error:', error);
    throw new Error('Failed to authenticate coach');
  }
};

// Client signup
export const signupClient = async (email: string, password: string, fullName: string): Promise<{ user: any; role: UserRole }> => {
  try {
    // Create user account using compat API
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;
    
    // Store user data in Firestore using compat API
    await db.collection('users').doc(user.uid).set({
      email,
      role: 'client',
      fullName,
      createdAt: new Date().toISOString()
    });
    
    return {
      user,
      role: 'client' as UserRole
    };
  } catch (error: any) {
    console.error('Signup error:', error);
    throw new Error(error.message || 'Failed to create account');
  }
};

// Client login
export const loginClient = async (email: string, password: string): Promise<{ user: any; role: UserRole }> => {
  try {
    // Sign in using compat API
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    const user = userCredential.user;
    
    // Get user role from Firestore using compat API
    const userDoc = await db.collection('users').doc(user.uid).get();
    const userData = userDoc.data() as UserData;
    
    return {
      user,
      role: userData?.role || 'client'
    };
  } catch (error: any) {
    console.error('Login error:', error);
    throw new Error(error.message || 'Failed to sign in');
  }
};

// Sign out
export const signOut = async (): Promise<void> => {
  try {
    await auth.signOut();
  } catch (error: any) {
    console.error('Sign out error:', error);
    throw new Error('Failed to sign out');
  }
};

// Get current user
export const getCurrentUser = (): any => {
  return auth.currentUser;
};

// Listen to auth state changes
export const onAuthStateChanged = (callback: (user: any) => void) => {
  return auth.onAuthStateChanged(callback);
};
