// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAIUgk1yaxXz1ZXmfgjbfKMVuVUU-vAEnA",
  authDomain: "prohub-3d621.firebaseapp.com",
  databaseURL: "https://prohub-3d621-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "prohub-3d621",
  storageBucket: "prohub-3d621.appspot.com",
  messagingSenderId: "43396697325",
  appId: "1:43396697325:web:da45106718b7aa842650e4",
  measurementId: "G-3FWFK2R49D"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getDatabase(app);

export { app, db };
