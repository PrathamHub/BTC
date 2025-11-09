import dotenv from "dotenv";
dotenv.config();
import connectDB from "../config/db.js";
import Product from "../models/Product.js";
import Stock from "../models/Stock.js";

await connectDB();

const products = [
  // 🧺 Fena Detergent Powder
  { name: "Fena 5kg", category: "Detergent" },
  { name: "Fena 3kg", category: "Detergent" },
  { name: "Fena 2kg", category: "Detergent" },
  { name: "Fena 1kg", category: "Detergent" },
  { name: "Fena 500g", category: "Detergent" },
  { name: "Fena 110g", category: "Detergent" },
  { name: "Fena 55g", category: "Detergent" },

  // 🧼 Cloth Washing Soap
  { name: "Mahabar 10rs", category: "Washing Soap" },
  { name: "Mahabar 5rs", category: "Washing Soap" },

  // 🍽️ Utensil Cleaning Soap
  { name: "Nip 5rs", category: "Utensil Soap" },
  { name: "Nip 10rs", category: "Utensil Soap" },
  { name: "Nip 30rs", category: "Utensil Soap" },

  // 🚿 Bathing Soap (Famous Soap - 4 Flavours)
  { name: "Famous Soap Rose", category: "Bathing Soap" },
  { name: "Famous Soap Jasmine", category: "Bathing Soap" },
  { name: "Famous Soap Sandal", category: "Bathing Soap" },
  { name: "Famous Soap Lemon", category: "Bathing Soap" },

  // 👕 Premium Bar for Clothes
  { name: "Premium Bar 200g", category: "Premium Bar" },
  { name: "Premium Bar 300g", category: "Premium Bar" },

  // 💨 Impact Powder Range
  { name: "Impact Powder 75g", category: "Impact Powder" },
  { name: "Impact Powder 500g", category: "Impact Powder" },
  { name: "Impact Powder 1kg", category: "Impact Powder" },
  { name: "Impact Powder 4kg", category: "Impact Powder" },
];

try {
  for (const p of products) {
    // Check if product already exists
    let product = await Product.findOne({ name: p.name });
    if (!product) product = await Product.create(p);

    // Check if stock entry exists
    const existingStock = await Stock.findOne({ product: product._id });
    if (!existingStock) {
      await Stock.create({
        product: product._id,
      });
    }
  }

  console.log("✅ Product and stock seeding completed successfully!");
} catch (err) {
  console.error("❌ Error seeding products:", err);
} finally {
  process.exit(0);
}
