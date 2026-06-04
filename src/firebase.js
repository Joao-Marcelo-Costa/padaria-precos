import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "padaria-precos.firebaseapp.com",
  projectId: "padaria-precos",
  storageBucket: "padaria-precos.firebasestorage.app",
  messagingSenderId: "807920337249",
  appId: "1:807920337249:web:70a8ce9a4816a8179fc520",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
