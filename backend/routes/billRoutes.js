import express from "express";
import {
  createBill,
  deleteBill,
  getAllBills,
  getBillsByCustomer,
} from "../controllers/billController.js";

const router = express.Router();
router.delete("/:id", deleteBill);
// router.put("/update/:id", updateBill);
router.post("/create", createBill);
router.get("/", getAllBills);
router.get("/:name", getBillsByCustomer);

export default router;
