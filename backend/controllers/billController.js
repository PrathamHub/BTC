import Bill from "../models/Bill.js";
import Customer from "../models/Customer.js";
import Product from "../models/Product.js";
import Stock from "../models/Stock.js";
import mongoose from "mongoose";
import { findOrCreateCustomer } from "../services/CustomerService.js";
import { updateStockForItems } from "../services/StockService.js";
import { createBillEntry } from "../services/BillService.js";

export const createBill = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { customerName, items, totalDispatch, grandTotal, freeItems, note } =
      req.body;

    if (!customerName || !totalDispatch?.length)
      return res.status(400).json({ message: "Invalid request data" });

    // 1️⃣ Find or create customer
    const customer = await findOrCreateCustomer(customerName, session);

    // 2️⃣ Update stock for sold items
    await updateStockForItems(totalDispatch, session);

    // 3️⃣ Create bill record
    const newBill = await createBillEntry(
      customerName,
      items,
      freeItems,
      grandTotal,
      session,
      note
    );

    // 4️⃣ Update customer amount
    customer.amount += grandTotal;
    customer.date = new Date();
    await customer.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      message: "✅ Bill created successfully and stock updated",
      bill: newBill,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: error.message });
  }
};

// 📍 Get all bills
export const getAllBills = async (req, res) => {
  try {
    const bills = await Bill.find().sort({ createdAt: -1 });

    res.json(bills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📍 Get bills by customer
export const getBillsByCustomer = async (req, res) => {
  try {
    const { name } = req.params;
    const bills = await Bill.find({
      customerName: { $regex: new RegExp(name, "i") },
    }).populate("items.product", "name price");

    if (bills.length === 0)
      return res
        .status(404)
        .json({ message: "No bills found for this customer" });

    res.json(bills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const deleteBill = async (req, res) => {
  try {
    const { id } = req.params;

    const bill = await Bill.findById(id);
    if (!bill) return res.status(404).json({ message: "Bill not found" });

    console.log("Deleting bill:", bill);

    // 1️⃣ Update stock for sold + free items
    for (const item of [...bill.items, ...bill.freeItems]) {
      console.log("Processing item:", item);

      let stock;
      if (item.product) {
        stock = await Stock.findOne({ product: item.product });
      } else if (item.name) {
        const product = await Product.findOne({ name: item.name });
        if (product) stock = await Stock.findOne({ product: product._id });
      }

      if (stock) {
        console.log(`Before update: ${item.name} - Bags: ${stock.bags}`);
        stock.bags += item.bags || 0;
        stock.lastUpdated = new Date();
        await stock.save();
        console.log(`After update: ${item.name} - Bags: ${stock.bags}`);
      } else {
        console.log("Stock not found for item:", item.name);
      }
    }

    // 2️⃣ Update customer
    const customer = await Customer.findOne({ name: bill.customerName });
    if (customer) {
      customer.totalAmount -= bill.totalAmount || 0;
      await customer.save();
      console.log(
        `Customer updated: ${customer.name} - Total Amount: ${customer.totalAmount}`
      );
    }

    // 3️⃣ Delete bill
    await Bill.findByIdAndDelete(id);
    console.log("Bill deleted:", id);

    res.status(200).json({ message: "Bill deleted successfully", bill });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
