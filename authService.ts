import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  User
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
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
export const loginWithSecretKey = async (secretKey: string): Promise<{ user: User; role: UserRole } | null> => {
  if (secretKey !== COACH_SECRET_KEY) {
    throw new Error('Invalid secret key');
  }
  
  try {
    // Sign in with coach credentials
    const userCredential = await signInWithEmailAndPassword(auth, COACH_EMAIL, COACH_PASSWORD);
    return {
      user: userCredential.user,
      role: UserRole.COACH
    };
  } catch (error: any) {
    // If coach account doesn't exist, create it
    if (error.code === 'auth/user-not-found') {
      const userCredential = await createUserWithEmailAndPassword(auth, COACH_EMAIL, COACH_PASSWORD);
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: COACH_EMAIL,
        role: UserRole.COACH,
        fullName: 'Ripped City Coach',
        createdAt: new Date().toISOString()
      });
      return {
        user: userCredential.user,
        role: UserRole.COACH
      };
    }
    throw error;
  }
};

// Client signup with email/password
export const signupClient = async (
  email: string, 
  password: string, 
  fullName: string,
  additionalData?: any
): Promise<{ user: User; role: UserRole }> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
  await setDoc(doc(db, 'users', userCredential.user.uid), {
    email,
    role: UserRole.CLIENT,
    fullName,
    createdAt: new Date().toISOString(),
    ...additionalData
  });
  
  return {
    user: userCredential.user,
    role: UserRole.CLIENT
  };
};

// Client login with email/password
export const loginClient = async (email: string, password: string): Promise<{ user: User; role: UserRole }> => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  
  // Get user role from Firestore
  const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
  const userData = userDoc.data() as UserData;
  
  return {
    user: userCredential.user,
    role: userData.role
  };
};

// Sign out
export const signOut = async (): Promise<void> => {
  await firebaseSignOut(auth);
};

// Get current user data
export const getCurrentUserData = async (uid: string): Promise<UserData | null> => {
  const userDoc = await getDoc(doc(db, 'users', uid));
  if (userDoc.exists()) {
    return userDoc.data() as UserData;
  }
  return null;
};
