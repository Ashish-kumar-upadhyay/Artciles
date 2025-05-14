import React from "react";
import { useNavigate } from "react-router-dom";
import { auth, provider, db } from "../firebase"; // db ko import karein
import { signInWithPopup } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import "./SignIn.css";

const SignUp = () => {
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
  
      // Firestore me user data save karna
      await setDoc(doc(db, "users", user.uid), {
        name: user.displayName,
        email: user.email,
        role: "user", // Default role
        createdAt: new Date(),
      }, { merge: true }); // Agar user already exist kare toh data overwrite na ho
  
      console.log("User Signed In: ", user);
      navigate("/user");
    } catch (error) {
      console.error("Error signing in: ", error.message);
    }
  };

  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <h1 className="welcome-title">Welcome to BlogVerse</h1>
        <p className="welcome-subtitle">Share your stories with the world</p>
        <button 
          onClick={handleGoogleSignIn} 
          className="google-signin-btn"
        >
          <img 
            src="https://www.google.com/favicon.ico" 
            alt="Google" 
            className="google-icon"
          />
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default SignUp;
