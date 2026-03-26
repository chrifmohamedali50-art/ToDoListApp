import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBlwTpZ75vyBRkKLb-0LiDW11z_9UkVOJM",
  authDomain: "database-a0ece.firebaseapp.com",
  projectId: "database-a0ece",
  storageBucket: "database-a0ece.firebasestorage.app",
  messagingSenderId: "597903289417",
  appId: "1:597903289417:web:d55b92ce839d558637a398"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);