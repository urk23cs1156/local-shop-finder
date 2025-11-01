import axios from "axios";
import { useState } from "react";

export default function CustomerDashboard() {
  const [query, setQuery] = useState({ products: "", city: "", state: "", pincode: "" });
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false); // ✅ To track if a search was done

  const searchShops = async () => {
    try {
      const products = query.products.split(",").map((p) => p.trim());
      const res = await axios.post("https://local-shop-finder-1.onrender.com/api/shop/search", {
        ...query,
        products,
      });
      setResults(res.data);
    } catch (err) {
      console.error("Search error:", err);
      setResults([]); // If any error, clear results
    } finally {
      setSearched(true); // ✅ Mark that search has been done
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🛍️ Customer Dashboard</h1>

      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <input
          className="border p-2 w-full mb-2 rounded"
          placeholder="Products (comma separated)"
          value={query.products}
          onChange={(e) => setQuery({ ...query, products: e.target.value })}
        />
        <input
          className="border p-2 w-full mb-2 rounded"
          placeholder="City"
          value={query.city}
          onChange={(e) => setQuery({ ...query, city: e.target.value })}
        />
        <input
          className="border p-2 w-full mb-2 rounded"
          placeholder="State"
          value={query.state}
          onChange={(e) => setQuery({ ...query, state: e.target.value })}
        />
        <input
          className="border p-2 w-full mb-2 rounded"
          placeholder="Pincode"
          value={query.pincode}
          onChange={(e) => setQuery({ ...query, pincode: e.target.value })}
        />
        <button
          onClick={searchShops}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      {/* ✅ Show message if search done and no results */}
      {searched && results.length === 0 && (
        <p className="text-gray-600 text-center mt-4">❌ No shops found matching your search.</p>
      )}

      {/* ✅ Display results if any */}
      {results.length > 0 && (
        <div>
          {results.map((shop, i) => (
            <div key={i} className="bg-white shadow p-4 rounded mb-3">
              <h2 className="font-semibold">{shop.shopName}</h2>
              <p>
                {shop.address}, {shop.city}, {shop.state} - {shop.pincode}
              </p>
              <ul className="mt-2">
                {shop.products.map((p) => (
                  <li key={p._id}>
                    🛒 {p.productName} - ₹{p.price} ({p.quantity})
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
