const { initializeApp } = require('firebase/app');
const { getFirestore, collection, setDoc, doc } = require('firebase/firestore');
const products = require('./products.json');

const firebaseConfig = {
  apiKey: "AIzaSyBHEYsuzFVQMTYA8Kz4PjoBEhbf7-u-ARY",
  authDomain: "shopapp-312d8.firebaseapp.com",
  projectId: "shopapp-312d8",
  storageBucket: "shopapp-312d8.appspot.com",
  messagingSenderId: "643459312709",
  appId: "1:643459312709:web:7f632c3014db990cfc472c"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function uploadProducts() {
  for (const product of products) {
    try {
      await setDoc(doc(collection(db, 'products'), product.id), product);
      console.log(`✅ Uploaded: ${product.name}`);
    } catch (error) {
      console.error(`❌ Error uploading ${product.name}:`, error.message);
    }
  }
}

uploadProducts();
