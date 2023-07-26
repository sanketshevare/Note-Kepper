import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAKB72yiiMr9hFuErJ9Eh9AJ1JTg8noG5U",
    authDomain: "notekeeper-2d7ef.firebaseapp.com",
    projectId: "notekeeper-2d7ef",
    storageBucket: "notekeeper-2d7ef.appspot.com",
    messagingSenderId: "710634045718",
    appId: "1:710634045718:web:05422fba35603f86add037"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);