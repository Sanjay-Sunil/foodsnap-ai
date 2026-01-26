// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCO9BdKPdvD8bITKTH6PWHhXBxYwPxnelU",
  authDomain: "foodsnapai-eb9e5.firebaseapp.com",
  projectId: "foodsnapai-eb9e5",
  storageBucket: "foodsnapai-eb9e5.firebasestorage.app",
  messagingSenderId: "395416911245",
  appId: "1:395416911245:web:b578bb7cae79ae5f71d1c4",
  measurementId: "G-8FR1DXGX7G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);