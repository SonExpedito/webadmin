// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAmmJAD6Wu6O5g0IY0XXhdy2k2uZZK12A0",
  authDomain: "decria-44a10.firebaseapp.com",
  projectId: "decria-44a10",
  storageBucket: "decria-44a10.appspot.com",
  messagingSenderId: "363245887474",
  appId: "1:363245887474:web:11764d377d6caadd08556b"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
