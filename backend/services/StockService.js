import Product from "../models/Product.js";
import Stock from "../models/Stock.js";

/**
 * Updates stock based only on number of bags sold.
 * Pieces are ignored for stock tracking (only used in bills for records).
 */
export const updateStockForItems = async (totalDispatch, session) => {
  for (const item of totalDispatch) {
    const { name, totalBags } = item;

    // Skip items with no bag sold
    if (!totalBags || totalBags <= 0) continue;

    // Find product
    const product = await Product.findOne({ name });
    if (!product) throw new Error(`❌ Product not found: ${name}`);

    // Find stock entry for that product
    const stock = await Stock.findOne({ product: product._id });
    if (!stock) throw new Error(`❌ Stock not found for ${name}`);

    // Check available stock
    if (stock.bags < totalBags) {
      throw new Error(
        `❌ Insufficient stock for ${name}. Available: ${stock.bags} bags, Required: ${totalBags} bags`
      );
    }

    // Deduct only bags
    stock.bags -= totalBags;
    stock.lastUpdated = new Date();

    // Save changes
    await stock.save({ session });
  }
};
