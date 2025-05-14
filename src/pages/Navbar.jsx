import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import "./Navbar.css"; // CSS file import karein

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/"); // Logout ke baad Home page pe redirect
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <nav className="navbar glass-navbar">
      <div className="navbar-container">
        <div className="logo gradient-logo">BlogVerse</div>
        <ul className="nav-links">
          <li>
            <Link to="/user" className="nav-link">Home</Link>
          </li>
          <li>
            <Link to="/article" className="nav-link">Write Articles</Link>
          </li>
          <li>
            <Link to="/my-articles" className="nav-link">MyArticles</Link>
          </li>
        </ul>
        <button className="logout-btn gradient-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
