import React, { useState } from "react";
import axios from "axios";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://local-shop-finder-1.onrender.com/api/auth/signup", {
        username,
        password,
        role,
      });
      alert("Signup successful! Please login.");
    } catch (err) {
      console.error(err);
      alert("Signup failed. Server error.");
    }
  };

  return (
    <div className="container">
      <h2>Signup</h2>
      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="customer">Customer</option>
          <option value="shopkeeper">Shopkeeper</option>
        </select>
        <button type="submit">Signup</button>
      </form>
    </div>
  );
}
