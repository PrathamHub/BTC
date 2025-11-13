import express from "express";
import {
  createBill,
  deleteBill,
  getAllBills,
  getBillsByCustomer,
} from "../controllers/billController.js";
import Bill from "../models/Bill.js";

const router = express.Router();
router.delete("/:id", deleteBill);
// router.put("/update/:id", updateBill);
router.post("/create", createBill);
router.get("/", getAllBills);
router.get("/:name", getBillsByCustomer);
router.put("/:id", async (req, res) => {
  try {
    const bill = await Bill.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true, // ✅ ensures schema validation
    });

    if (!bill) {
      return res.status(404).json({ message: "Bill not found" });
    }

    res.json(bill);
  } catch (error) {
    console.error("Error updating bill:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
