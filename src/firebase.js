// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAa-8DLxOXK4ByI5xzr9ft2KsGG_Ldh_jg",
  authDomain: "padaria-precos.firebaseapp.com",
  databaseURL: "https://padaria-precos-default-rtdb.firebaseio.com",
  projectId: "padaria-precos",
  storageBucket: "padaria-precos.firebasestorage.app",
  messagingSenderId: "807920337249",
  appId: "1:807920337249:web:70a8ce9a4816a8179fc520",
  measurementId: "G-1JRT7BK8H6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
