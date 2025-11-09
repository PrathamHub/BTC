import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g., "Fena 5kg"
  category: { type: String, required: true }, // e.g., "Detergent", "Washing Soap"
  unit: { type: String, default: "pcs" }, // optional
});

const Product = mongoose.model("Product", productSchema);
export default Product;
