import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// import { getStorage } from "firebase/storage";
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
const firebaseConfig = {
  apiKey: "AIzaSyDwWa_rqaCxy8rSc1bzrVI4LppszriY5JI",
  authDomain: "mystore-43ea7.firebaseapp.com",
  projectId: "mystore-43ea7",
  storageBucket: "mystore-43ea7.firebasestorage.app",
  messagingSenderId: "88357415448",
  appId: "1:88357415448:web:4b99acaae838c6a60e716d",
  measurementId: "G-BXL79J8VK5",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
