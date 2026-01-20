import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp 
} from 'firebase/firestore';

// Client operations
export const saveClient = async (clientData: any) => {
  try {
    const clientsRef = collection(db, 'clients');
    const docRef = await addDoc(clientsRef, {
      ...clientData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      status: 'active'
    });
    console.log('✅ Client saved to Firestore with ID:', docRef.id);
    return { id: docRef.id, ...clientData };
  } catch (error) {
    console.error('❌ Error saving client:', error);
    throw error;
  }
};

export const getAllClients = async () => {
  try {
    const clientsRef = collection(db, 'clients');
    const q = query(clientsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const clients = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    console.log('📦 Loaded', clients.length, 'clients from Firestore');
    return clients;
  } catch (error) {
    console.error('❌ Error loading clients:', error);
    return [];
  }
};

export const updateClient = async (clientId: string, updates: any) => {
  try {
    const clientRef = doc(db, 'clients', clientId);
    await updateDoc(clientRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
    console.log('✅ Client updated:', clientId);
  } catch (error) {
    console.error('❌ Error updating client:', error);
    throw error;
  }
};

export const deleteClient = async (clientId: string) => {
  try {
    const clientRef = doc(db, 'clients', clientId);
    await deleteDoc(clientRef);
    console.log('✅ Client deleted:', clientId);
  } catch (error) {
    console.error('❌ Error deleting client:', error);
    throw error;
  }
};

// Progress photos operations
export const saveProgressPhoto = async (clientId: string, photoData: any) => {
  try {
    const photosRef = collection(db, 'progress_photos');
    const docRef = await addDoc(photosRef, {
      clientId,
      ...photoData,
      createdAt: Timestamp.now()
    });
    console.log('✅ Progress photo saved:', docRef.id);
    return { id: docRef.id, ...photoData };
  } catch (error) {
    console.error('❌ Error saving progress photo:', error);
    throw error;
  }
};

export const getClientPhotos = async (clientId: string) => {
  try {
    const photosRef = collection(db, 'progress_photos');
    const q = query(
      photosRef, 
      where('clientId', '==', clientId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    const photos = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    console.log('📸 Loaded', photos.length, 'photos for client:', clientId);
    return photos;
  } catch (error) {
    console.error('❌ Error loading photos:', error);
    return [];
  }
};
