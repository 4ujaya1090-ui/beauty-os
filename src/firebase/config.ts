import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBOwErMZ_iynVVSO7yJr3v1b_xfk-_qthY",
  authDomain: "beauty-os-ae06f.firebaseapp.com",
  projectId: "beauty-os-ae06f",
  storageBucket: "beauty-os-ae06f.firebasestorage.app",
  messagingSenderId: "783376210258",
  appId: "1:783376210258:web:57e6a1d858fd1cbd1d428b",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);