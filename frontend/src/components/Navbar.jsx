import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <h2>🛍️ Local Shop</h2>
      <div>
        <Link to="/">Login</Link>
        <Link to="/signup">Signup</Link>
      </div>
    </nav>
  );
}
