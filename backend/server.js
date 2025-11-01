const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { mongoURI } = require("./config");

const authRoutes = require("./routes/auth");
const shopRoutes = require("./routes/shop");

const app = express();

// ✅ Allow both local and deployed frontend URLs
app.use(
  cors({
    origin: [
      "http://localhost:5173", // for local testing
      "https://localshop-frontend.onrender.com" // ✅ replace with your Render frontend URL
    ],
    credentials: true,
  })
);

app.use(express.json());

// ✅ Connect to MongoDB
mongoose
  .connect(mongoURI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Use routes
app.use("/api/auth", authRoutes);
app.use("/api/shop", shopRoutes);

// ✅ Default route
app.get("/", (req, res) => res.send("Local Shop API is running 🚀"));

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
