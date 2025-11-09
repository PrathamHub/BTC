import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

// Import Routes
import customerRoutes from "./routes/customerRoutes.js";
import stockRoutes from "./routes/stockRoutes.js";
import BillRoutes from "./routes/billRoutes.js";
// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();
const allowedOrigins = ["https://btc-1-3i51.onrender.com/"];
// Middleware
app.use(cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("❌ Not allowed by CORS"));
      }
    },
    credentials: true, // if you ever send cookies / tokens
}));
app.use(express.json());

// Routes
app.use("/api/customers", customerRoutes);
app.use("/api/stocks", stockRoutes);
app.use("/api/bill", BillRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("Fena Project API is running 🚀");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
