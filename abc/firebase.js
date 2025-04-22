// firebase.js
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBHEYsuzFVQMTYA8Kz4PjoBEhbf7-u-ARY",
  authDomain: "shopapp-312d8.firebaseapp.com",
  projectId: "shopapp-312d8",
  storageBucket: "shopapp-312d8.appspot.com",
  messagingSenderId: "643459312709",
  appId: "1:643459312709:web:7f632c3014db990cfc472c",
  measurementId: "G-Y1PHQGT9L3"
};

// 👇 Chỉ initialize app nếu chưa có app nào tồn tại
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
