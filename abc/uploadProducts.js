// uploadProducts.js
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import products from './products_clean.json' assert { type: 'json' };

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyBHEYsuzFVQMTYA8Kz4PjoBEhbf7-u-ARY",
    authDomain: "shopapp-312d8.firebaseapp.com",
    projectId: "shopapp-312d8",
    storageBucket: "shopapp-312d8.firebasestorage.app",
    messagingSenderId: "643459312709",
    appId: "1:643459312709:web:7f632c3014db990cfc472c",
    measurementId: "G-Y1PHQGT9L3"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const uploadProducts = async () => {
  for (const product of products) {
    try {
      await addDoc(collection(db, 'products'), product);
      console.log(`✅ Đã upload: ${product.name}`);
    } catch (error) {
      console.log(`❌ Lỗi khi upload ${product.name}:`, error);
    }
  }
};

uploadProducts();
