import mongoose from "mongoose";

const billSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
  },
  items: [
    {
      name: String,
      sellingPrice: Number,
      quantity: Number,
      bags: Number,
      pieces: Number,
    },
  ],
  freeItems: [
    {
      name: String,
      quantity: Number,
      bags: Number,
      pieces: Number,
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  note: {
    type: String,
  },
});

export default mongoose.model("Bill", billSchema);
