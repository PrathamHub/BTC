import express from "express";
import { getAllStocks, updateStock } from "../controllers/stockController.js";

const router = express.Router();

router.get("/", getAllStocks); // GET all stocks
router.post("/update", updateStock); // POST { productName, quantityChange }

export default router;
