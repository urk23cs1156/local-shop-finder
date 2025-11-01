import React, { useState } from "react";
import axios from "axios";
import "./AddressPrompt.css"; // create this for styling (optional)

const backendURL = "https://local-shop-finder-1.onrender.com/api/shop/search";

export default function AddressPrompt() {
  const [productName, setProductName] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    if (!productName) {
      alert("Please enter a product name");
      return;
    }

    try {
      const res = await axios.post(backendURL, { productName, city, pincode });
      setResults(res.data);
    } catch (err) {
      console.error(err);
      alert("Search failed");
    }
  };

  return (
    <div className="address-container">
      <h2>Search for a Product Nearby</h2>

      <div className="form-group">
        <input
          type="text"
          placeholder="Enter product name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter pincode"
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <div className="results">
        {results.length === 0 ? (
          <p>No products found</p>
        ) : (
          results.map((shop) => (
            <div key={shop._id} className="shop-card">
              <h3>{shop.shopName}</h3>
              <p>
                {shop.address}, {shop.city}, {shop.state} - {shop.pincode}
              </p>
              {shop.products
                .filter((p) =>
                  p.productName.toLowerCase().includes(productName.toLowerCase())
                )
                .map((p, i) => (
                  <div key={i}>
                    <strong>{p.productName}</strong> — ₹{p.price} ({p.quantity} pcs)
                    <span style={{ color: p.available ? "green" : "red" }}>
                      {" "}
                      {p.available ? "Available" : "Out of stock"}
                    </span>
                  </div>
                ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
