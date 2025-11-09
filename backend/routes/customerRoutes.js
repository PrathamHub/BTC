import express from "express";
import {
  createCustomer,
  getAllCustomers,
  searchCustomers,
  getCustomerByName,
  updateCustomer,
  deleteCustomer,
  getTotalAmount,
} from "../controllers/customerController.js";

const router = express.Router();

// Routes
router.post("/", createCustomer); // ➕ Add new customer
router.get("/", getAllCustomers); // 📜 List all customers (optionally filter by date)
router.get("/total", getTotalAmount); // 💰 Get total amount from all customers
router.get("/name/:name", getCustomerByName);
router.get("/search", searchCustomers);
router.put("/:id", updateCustomer); // ✏️ Update customer
router.delete("/:id", deleteCustomer); // ❌ Delete customer

export default router;
