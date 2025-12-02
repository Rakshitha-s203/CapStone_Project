// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAm6jnaBpzfm5fKsGvWiI4HA_iyy9v_KgA",
  authDomain: "smart-path-fe85d.firebaseapp.com",
  databaseURL: "https://smart-path-fe85d-default-rtdb.firebaseio.com",
  projectId: "smart-path-fe85d",
  storageBucket: "smart-path-fe85d.firebasestorage.app",
  messagingSenderId: "948301953677",
  appId: "1:948301953677:web:03f345e05fe84989af40c4",
  measurementId: "G-BN9MFMHMCK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);