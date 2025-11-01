const express = require("express");
const router = express.Router();
const Shop = require("../models/Shop");
const auth = require("../middleware/auth");

// ---------------------- GET SHOP DETAILS ----------------------
router.get("/details", auth, async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.user.userId });
    if (!shop) return res.status(404).json({ message: "Shop not found" });
    res.json(shop);
  } catch (err) {
    console.error("Fetch shop error:", err);
    res.status(500).json({ error: "Server error while fetching shop" });
  }
});

// ---------------------- SAVE OR UPDATE SHOP ----------------------
router.post("/save-shop", auth, async (req, res) => {
  try {
    const { shopName, address, city, state, pincode } = req.body;

    if (!shopName || !address)
      return res
        .status(400)
        .json({ error: "Shop name and address are required" });

    let shop = await Shop.findOne({ owner: req.user.userId });

    if (shop) {
      // Update existing shop
      shop.shopName = shopName;
      shop.address = address;
      shop.city = city;
      shop.state = state;
      shop.pincode = pincode;
      await shop.save();
      res.json({ message: "Shop updated successfully", shop });
    } else {
      // Create new shop
      const newShop = new Shop({
        owner: req.user.userId,
        shopName,
        address,
        city,
        state,
        pincode,
        products: [],
      });
      await newShop.save();
      res.json({ message: "Shop created successfully", shop: newShop });
    }
  } catch (err) {
    console.error("Save shop error:", err);
    res.status(500).json({ error: "Server error while saving shop" });
  }
});

// ---------------------- ADD / UPDATE PRODUCT ----------------------
router.post("/add-product", auth, async (req, res) => {
  try {
    const { productName, price, quantity } = req.body;
    if (!productName)
      return res.status(400).json({ error: "Product name required" });

    const shop = await Shop.findOne({ owner: req.user.userId });
    if (!shop) return res.status(404).json({ error: "Shop not found" });

    const existing = shop.products.find(
      (p) => p.productName.toLowerCase() === productName.toLowerCase()
    );

    if (existing) {
      existing.price = price;
      existing.quantity = quantity;
    } else {
      shop.products.push({ productName, price, quantity, available: true });
    }

    await shop.save();
    res.json({
      message: "Product added/updated successfully",
      products: shop.products,
    });
  } catch (err) {
    console.error("Add product error:", err);
    res.status(500).json({ error: "Server error while adding product" });
  }
});

// ---------------------- UPDATE PRODUCT ----------------------
router.put("/update-product/:productId", auth, async (req, res) => {
  try {
    const { price, quantity } = req.body;
    const shop = await Shop.findOne({ owner: req.user.userId });
    if (!shop) return res.status(404).json({ error: "Shop not found" });

    const product = shop.products.id(req.params.productId);
    if (!product) return res.status(404).json({ error: "Product not found" });

    product.price = price;
    product.quantity = quantity;
    await shop.save();
    res.json({ message: "Product updated", products: shop.products });
  } catch (err) {
    console.error("Update product error:", err);
    res.status(500).json({ error: "Server error while updating product" });
  }
});

// ---------------------- DELETE PRODUCT ----------------------
router.delete("/delete-product/:productId", auth, async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.user.userId });
    if (!shop) return res.status(404).json({ error: "Shop not found" });

    const product = shop.products.id(req.params.productId);
    if (!product) return res.status(404).json({ error: "Product not found" });

    product.deleteOne();
    await shop.save();
    res.json({
      message: "Product deleted successfully",
      products: shop.products,
    });
  } catch (err) {
    console.error("Delete product error:", err);
    res.status(500).json({ error: "Server error while deleting product" });
  }
});

// ---------------------- CUSTOMER SEARCH (Updated Flexible Logic) ----------------------
router.post("/search", async (req, res) => {
  try {
    const { address, city, state, pincode, products } = req.body;

    // ✅ Normalize all input fields
    const normalizedAddress = (
      ((address || "") + (city || "") + (state || "") + (pincode || ""))
        .toLowerCase()
        .replace(/\s+/g, "")
    );

    const normalizedProducts = (products || [])
      .map((p) => p.toLowerCase().trim())
      .filter((p) => p.length > 0);

    // ✅ Fetch all shops
    const shops = await Shop.find();

    // ✅ Filter based on address & product matches
    const filtered = shops.filter((shop) => {
      const shopAddr = (
        (shop.address || "") +
        (shop.city || "") +
        (shop.state || "") +
        (shop.pincode || "")
      )
        .toLowerCase()
        .replace(/\s+/g, "");

      // Match address partially (case-insensitive)
      const addressMatch =
        !normalizedAddress || shopAddr.includes(normalizedAddress);

      // Match at least one product (case-insensitive)
      const productMatch =
        normalizedProducts.length === 0 ||
        shop.products.some((prod) =>
          normalizedProducts.some((query) =>
            prod.productName.toLowerCase().includes(query)
          )
        );

      return addressMatch && productMatch;
    });

    // ✅ Updated — no more 404 error
    if (filtered.length === 0) {
      return res.status(200).json([]); // Return empty array instead of 404
    }

    res.json(filtered);
  } catch (err) {
    console.error("❌ Search error:", err);
    res.status(500).json({ error: "Server error during search" });
  }
});

module.exports = router;
