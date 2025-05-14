import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAYY81oTtcWgKHki2U3bHfMkf1wxXZoz5Y",
    authDomain: "blogging-cd0c3.firebaseapp.com",
    projectId: "blogging-cd0c3",
    storageBucket: "blogging-cd0c3.firebasestorage.app",
    messagingSenderId: "301629383839",
    appId: "1:301629383839:web:906c01a1c58dd736ffeeaa",
    measurementId: "G-LXCFC83QG1"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();


export { db, auth, provider };

