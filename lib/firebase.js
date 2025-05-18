// lib/firebase.js
import { initializeApp } from 'firebase/app';
import {
  initializeAuth,
  getReactNativePersistence,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  orderBy,
  enableIndexedDbPersistence
} from 'firebase/firestore';
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 1) Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyARUXFpO5Ei1b82O5vf6cOo9ZMNKpJTXXI",
  authDomain: "lms-7b724.firebaseapp.com",
  projectId: "lms-7b724",
  storageBucket: "lms-7b724.appspot.com",
  messagingSenderId: "328981327205",
  appId: "1:328981327205:ios:922be37928513b4e8e858c",
};

// 2) Initialize App
const app = initializeApp(firebaseConfig);

// 3) Auth / Firestore / Storage
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
export const db      = getFirestore(app);
export const storage = getStorage(app);

// 4) Collection refs
export const usersCol  = collection(db, 'users');
export const menuCol   = collection(db, 'menu');
export const ordersCol = collection(db, 'orders');
export const bookingCol   = collection(db, 'Booking');

// --- Auth helpers ---
export async function createUser(email, password, username, phoneNumber = '') {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  const user = cred.user;
  const avatarUrl = `https://api.dicebear.com/6.x/initials/svg?seed=${username}`;
  await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid,
    email: user.email,
    username,
    phoneNumber,
    avatarUrl,
    createdAt: new Date(),
  });
  return user;
}

export const login  = (email, password) => signInWithEmailAndPassword(auth, email, password);
export const logout = () => firebaseSignOut(auth);
export function onAuthState(cb) {
  return onAuthStateChanged(auth, cb);
}

// --- Storage helpers ---
export const uploadImage = (path, blob) => uploadBytes(storageRef(storage, path), blob);
export const getImageUrl   = (path) => getDownloadURL(storageRef(storage, path));

export const uploadOrder = async (order) => {
  // Implement the logic to upload the order to Firestore
  console.log("Order uploaded:", order);
};

// --- Firestore helpers ---
export const fetchUserOrders = async (uid) => {
  const q = query(
    ordersCol,
    where('userId', '==', uid),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export async function fetchUserBookings(uid) {
  const q = query(bookingCol, where('userId', '==', uid), orderBy('date', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

