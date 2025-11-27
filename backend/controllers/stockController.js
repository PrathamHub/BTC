import Product from "../models/Product.js";
import Stock from "../models/Stock.js";

// Get all stock items
export const getAllStocks = async (req, res) => {
  try {
    const stocks = await Stock.find().populate("product");
    res.json(stocks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update stock for multiple products
export const updateStock = async (req, res) => {
  try {
    console.log("🔵 Received update request:");
    console.log(req.body); // FULL BODY

    const { updates } = req.body;

    if (!updates || !Array.isArray(updates)) {
      return res.status(400).json({ message: "Invalid input format" });
    }

    const results = [];

    for (const item of updates) {
      console.log("🟡 Processing item:", item);

      const { productName, quantity, mode } = item;

      if (!productName || quantity === undefined) {
        console.log("⚠️ Missing fields, skipping item.");
        continue;
      }

      // Find product
      const product = await Product.findOne({ name: productName });
      if (!product) {
        console.log(`❌ Product not found: ${productName}`);
        results.push({ productName, status: "Product not found" });
        continue;
      }

      // Get existing stock
      let stock = await Stock.findOne({ product: product._id });

      if (!stock) {
        console.log("📦 Creating new stock entry...");
        stock = new Stock({
          product: product._id,
          bags: 0,
          lastUpdated: Date.now(),
        });
      }

      console.log("📘 Current stock:", stock.bags);
      console.log("📙 Quantity received:", quantity);
      console.log("📗 Mode:", mode);

      // UPDATE LOGIC
      if (mode === "add") {
        stock.bags += quantity;
        console.log("➕ New stock after ADD:", stock.bags);
      } else if (mode === "replace") {
        stock.bags = quantity;
        console.log("♻️ New stock after REPLACE:", stock.bags);
      }

      stock.lastUpdated = Date.now();
      const updatedStock = await stock.save();

      results.push({
        productName,
        status: "Stock updated",
        stock: updatedStock,
      });
    }

    res.status(200).json({ message: "Stock update complete", results });
  } catch (error) {
    console.error("🔥 Error updating stock:", error);
    res
      .status(500)
      .json({ message: "Error updating stock", error: error.message });
  }
};
