import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAK_qUCq25qJEwa7W6-vBu2XzM0uq-zzPE",
  authDomain: "job-portal-a8b09.firebaseapp.com",
  projectId: "job-portal-a8b09",
  storageBucket: "job-portal-a8b09.firebasestorage.app",
  messagingSenderId: "769690561407",
  appId: "1:769690561407:web:114c230e7b3fd1d27b084a"
};

const app = initializeApp(firebaseConfig);

export default app;