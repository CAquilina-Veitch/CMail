import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getMessaging, isSupported } from 'firebase/messaging';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAIl4vWF73TBXAyI7G_Fw9sxtD63innGag",
  authDomain: "photo-collage-app-9e42d.firebaseapp.com",
  projectId: "photo-collage-app-9e42d",
  storageBucket: "photo-collage-app-9e42d.firebasestorage.app",
  messagingSenderId: "82565536571",
  appId: "1:82565536571:web:de4bd1ddc0a4b8ea6bb51e",
  measurementId: "G-P3Y1KYM0P9",
};

// Whitelisted users
export const WHITELISTED_EMAILS: string[] = [
  'codethathat@gmail.com',
  'marsha.o.y@gmail.com',
];

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Firestore
export const db = getFirestore(app);

// Storage
export const storage = getStorage(app);

// Messaging (for push notifications)
// Note: Messaging only works in supported browsers (not Safari iOS < 16.4)
export const getMessagingInstance = async () => {
  const supported = await isSupported();
  if (supported) {
    return getMessaging(app);
  }
  return null;
};

// VAPID key for web push - generate this in Firebase Console:
// Project Settings > Cloud Messaging > Web Push certificates > Generate key pair
// Replace this placeholder with your actual VAPID key
export const VAPID_KEY = 'YOUR_VAPID_KEY_HERE';

export default app;
