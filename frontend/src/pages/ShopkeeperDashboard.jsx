import { useEffect, useState } from "react";
import axios from "axios";

export default function ShopkeeperDashboard() {
  const [shop, setShop] = useState(null);
  const [shopForm, setShopForm] = useState({
    shopName: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [productForm, setProductForm] = useState({
    productName: "",
    price: "",
    quantity: "",
  });
  const [editId, setEditId] = useState(null);
  const token = localStorage.getItem("token");

  const api = axios.create({
    baseURL: "http://localhost:3000/api",
    headers: { Authorization: `Bearer ${token}` },
  });

  // Load shop details
  useEffect(() => {
    api.get("/shop/details").then(res => {
      setShop(res.data);
      setShopForm({
        shopName: res.data.shopName || "",
        address: res.data.address || "",
        city: res.data.city || "",
        state: res.data.state || "",
        pincode: res.data.pincode || "",
      });
    }).catch(() => console.log("No shop found yet"));
  }, []);

  const saveShop = async () => {
    await api.post("/shop/save-shop", shopForm);
    alert("Shop saved/updated!");
    const res = await api.get("/shop/details");
    setShop(res.data);
  };

  const saveProduct = async () => {
    if (editId) {
      await api.put(`/shop/update-product/${editId}`, {
        price: productForm.price,
        quantity: productForm.quantity,
      });
    } else {
      await api.post("/shop/add-product", productForm);
    }
    setProductForm({ productName: "", price: "", quantity: "" });
    setEditId(null);
    const res = await api.get("/shop/details");
    setShop(res.data);
  };

  const deleteProduct = async (id) => {
    await api.delete(`/shop/delete-product/${id}`);
    const res = await api.get("/shop/details");
    setShop(res.data);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🏪 Shopkeeper Dashboard</h1>

      {/* Shop Info */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="font-semibold mb-2">Shop Details</h2>
        {["shopName", "address", "city", "state", "pincode"].map((field) => (
          <input
            key={field}
            className="border p-2 w-full mb-2 rounded"
            placeholder={field}
            value={shopForm[field]}
            onChange={(e) => setShopForm({ ...shopForm, [field]: e.target.value })}
          />
        ))}
        <button
          onClick={saveShop}
          className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
        >
          Save Shop
        </button>
      </div>

      {/* Product CRUD */}
      {shop && (
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="font-semibold mb-2">Products</h2>

          <div className="flex gap-2 mb-3">
            <input
              className="border p-2 flex-1 rounded"
              placeholder="Product Name"
              value={productForm.productName}
              onChange={(e) => setProductForm({ ...productForm, productName: e.target.value })}
            />
            <input
              className="border p-2 w-24 rounded"
              placeholder="Price"
              value={productForm.price}
              onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
            />
            <input
              className="border p-2 w-24 rounded"
              placeholder="Qty"
              value={productForm.quantity}
              onChange={(e) => setProductForm({ ...productForm, quantity: e.target.value })}
            />
            <button
              onClick={saveProduct}
              className="bg-green-600 text-white px-3 rounded"
            >
              {editId ? "Update" : "Add"}
            </button>
          </div>

          <ul>
            {shop.products?.map((p) => (
              <li key={p._id} className="flex justify-between bg-white p-2 mb-2 rounded">
                <span>{p.productName} - ₹{p.price} ({p.quantity})</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setProductForm(p);
                      setEditId(p._id);
                    }}
                    className="text-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteProduct(p._id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
