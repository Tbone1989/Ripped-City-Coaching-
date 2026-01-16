// Client data service using Firestore
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { db } from '../firebase';

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  age?: number;
  weight?: number;
  height?: number;
  goal?: string;
  startDate: string;
  status: 'active' | 'inactive';
  coachId: string;
  photoURL?: string;
  notes?: string;
}

// Add a new client
export const addClient = async (clientData: Omit<Client, 'id'>): Promise<string> => {
  const clientRef = doc(collection(db, 'clients'));
  await setDoc(clientRef, {
    ...clientData,
    createdAt: new Date().toISOString()
  });
  return clientRef.id;
};

// Get a single client
export const getClient = async (clientId: string): Promise<Client | null> => {
  const clientDoc = await getDoc(doc(db, 'clients', clientId));
  if (clientDoc.exists()) {
    return { id: clientDoc.id, ...clientDoc.data() } as Client;
  }
  return null;
};

// Get all clients for a coach
export const getCoachClients = async (coachId: string): Promise<Client[]> => {
  const q = query(
    collection(db, 'clients'),
    where('coachId', '==', coachId),
    orderBy('startDate', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Client[];
};

// Update client data
export const updateClient = async (
  clientId: string,
  updates: Partial<Client>
): Promise<void> => {
  await updateDoc(doc(db, 'clients', clientId), {
    ...updates,
    updatedAt: new Date().toISOString()
  });
};

// Delete a client
export const deleteClient = async (clientId: string): Promise<void> => {
  await deleteDoc(doc(db, 'clients', clientId));
};

// Get client by user ID
export const getClientByUserId = async (userId: string): Promise<Client | null> => {
  const q = query(collection(db, 'clients'), where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Client;
  }
  return null;
};
