import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC473WUwcZZfxGL4wPk96wUIiwzMfhVycw",
  authDomain: "veriphone-d83b1.firebaseapp.com",
  projectId: "veriphone-d83b1",
  storageBucket: "veriphone-d83b1.appspot.com",
  messagingSenderId: "645949567156",
  appId: "1:645949567156:web:2682da891d889e95a5e7e1"
};

// Initialize Firebase in a way that is safe for hot-reloading
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };