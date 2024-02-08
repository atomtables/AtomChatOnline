// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCihfq3MRr4LAIv7jMt0N9a-zlmfSW7VXU",
    authDomain: "atomchatonline.firebaseapp.com",
    databaseURL: "https://atomchatonline-default-rtdb.firebaseio.com",
    projectId: "atomchatonline",
    storageBucket: "atomchatonline.appspot.com",
    messagingSenderId: "568455503283",
    appId: "1:568455503283:web:38095b6e9c45988939bfc6",
    measurementId: "G-TR07XHM26M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)