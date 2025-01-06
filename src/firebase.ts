import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyAdqTa5ScOEyMtiVtwNyDkiIQSop0e9ZlY",
  authDomain: "sb-alpine-tours.firebaseapp.com",
  databaseURL: "https://sb-alpine-tours-default-rtdb.firebaseio.com",
  projectId: "sb-alpine-tours",
  storageBucket: "sb-alpine-tours.firebasestorage.app",
  messagingSenderId: "820077641021",
  appId: "1:820077641021:web:9d7224ce64e6bdbccb1954",
  measurementId: "G-T1889PMWRE"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);