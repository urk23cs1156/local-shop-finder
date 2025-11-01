const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  quantity: { type: Number, default: 0 },
  price: { type: Number, default: 0 },
  available: { type: Boolean, default: true },
});

const shopSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    shopName: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
    products: [productSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Shop", shopSchema);
