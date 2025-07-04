import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB2GeZEZ2m2Qwq4nEzmeLlIrhN61DQusvg",
  authDomain: "ibkangaji.firebaseapp.com",
  projectId: "ibkangaji",
  storageBucket: "ibkangaji.firebasestorage.app",
  messagingSenderId: "401662109480",
  appId: "1:401662109480:web:768935620ffc698cd8521d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

export default app;