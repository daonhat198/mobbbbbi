import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ✅ Firebase config của bạn
const firebaseConfig = {
  apiKey: "AIzaSyBHEYsuzFVQMTYA8Kz4PjoBEhbf7-u-ARY",
  authDomain: "shopapp-312d8.firebaseapp.com",
  projectId: "shopapp-312d8",
  storageBucket: "shopapp-312d8.appspot.com",
  messagingSenderId: "643459312709",
  appId: "1:643459312709:web:7f632c3014db990cfc472c",
  measurementId: "G-Y1PHQGT9L3"
};

// ✅ Khởi tạo app
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// ✅ Khởi tạo Auth với persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),  // Sử dụng AsyncStorage để duy trì trạng thái đăng nhập
});

const db = getFirestore(app);

export { auth, db };
