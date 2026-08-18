import { initializeApp, getApps, getApp } from "firebase/app";

import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBRmL0YpBhcOo9Bo-vsUxCuP7sSTpO9l00",
  authDomain: "ekhalo1.firebaseapp.com",
  projectId: "ekhalo1",
  storageBucket: "ekhalo1.firebasestorage.app",
  messagingSenderId: "739878595165",
  appId: "1:739878595165:web:5e683a36c35aa802de3bb4"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);

export const storage = getStorage(app);

export default app;
