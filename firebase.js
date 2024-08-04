// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAgooWx7OV3cZoi5jYvHLWP0bU-Iunn8Cw",
  authDomain: "inventory-management-app-ab28e.firebaseapp.com",
  projectId: "inventory-management-app-ab28e",
  storageBucket: "inventory-management-app-ab28e.appspot.com",
  messagingSenderId: "301472904058",
  appId: "1:301472904058:web:04ca289cc2bf8f70d11cc3",
  measurementId: "G-K832S90FKJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export {firestore}