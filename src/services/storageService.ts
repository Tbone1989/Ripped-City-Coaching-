// Storage service for handling image uploads
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../firebase';

// Upload image to Firebase Storage
export const uploadImage = async (
  file: File,
  path: string
): Promise<string> => {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
};

// Upload profile picture
export const uploadProfilePicture = async (
  userId: string,
  file: File
): Promise<string> => {
  const path = `profile-pictures/${userId}/${Date.now()}_${file.name}`;
  return await uploadImage(file, path);
};

// Upload progress photo
export const uploadProgressPhoto = async (
  clientId: string,
  file: File
): Promise<string> => {
  const path = `progress-photos/${clientId}/${Date.now()}_${file.name}`;
  return await uploadImage(file, path);
};

// Upload meal photo
export const uploadMealPhoto = async (
  clientId: string,
  file: File
): Promise<string> => {
  const path = `meal-photos/${clientId}/${Date.now()}_${file.name}`;
  return await uploadImage(file, path);
};

// Upload landing page image (for coach CMS)
export const uploadLandingPageImage = async (
  section: string,
  file: File
): Promise<string> => {
  const path = `landing-page/${section}/${Date.now()}_${file.name}`;
  return await uploadImage(file, path);
};

// Delete image from storage
export const deleteImage = async (imageUrl: string): Promise<void> => {
  const imageRef = ref(storage, imageUrl);
  await deleteObject(imageRef);
};
