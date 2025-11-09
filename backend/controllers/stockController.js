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
    const { updates } = req.body;

    if (!updates || !Array.isArray(updates)) {
      return res.status(400).json({ message: "Invalid input format" });
    }

    const results = [];

    for (const item of updates) {
      const { productName, bags } = item;

      if (!productName || bags === undefined) continue;

      // Find the product by name
      const product = await Product.findOne({ name: productName });
      if (!product) {
        results.push({ productName, status: "Product not found" });
        continue;
      }

      // Update or create stock
      const updatedStock = await Stock.findOneAndUpdate(
        { product: product._id },
        { bags, lastUpdated: Date.now() },
        { new: true, upsert: true } // create if not exists
      );

      results.push({
        productName,
        status: "Stock updated",
        stock: updatedStock,
      });
    }

    res.status(200).json({ message: "Stock update process complete", results });
  } catch (error) {
    console.error("Error updating stock:", error);
    res
      .status(500)
      .json({ message: "Error updating stock", error: error.message });
  }
};
