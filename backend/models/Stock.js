import mongoose from "mongoose";

const stockSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
    unique: true,
  },
  bags: {
    type: Number,
    required: true,
    default: 100, // default initial stock
    min: 0,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

const Stock = mongoose.model("Stock", stockSchema);
export default Stock;
