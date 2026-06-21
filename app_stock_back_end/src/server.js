import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./config/db.js";

dotenv.config();

const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// RENDRE LES IMAGES ACCESSIBLES
app.use("/uploads", express.static("uploads"));

// ============================
//   TEST ROUTE
// ============================
app.get("/", (req, res) => {
  res.json({ message: "Backend OK" });
});

// ============================
//   AUTH ROUTES
// ============================
import authRoutes from "./routes/auth.js";
app.use("/auth", authRoutes);

// ============================
//   PRODUCT ROUTES
// ============================
import productRoutes from "./routes/products.js";
app.use("/api/products", productRoutes);

// ============================
//   CATEGORY ROUTES
// ============================
import categoryRoutes from "./routes/categories.js";
app.use("/api/categories", categoryRoutes);

import movementRoutes from "./routes/movements.js";
app.use("/api/movements", movementRoutes);

import dashboardRoutes from "./routes/dashboard.js";
app.use("/api/dashboard", dashboardRoutes);

import chartRoutes from "./routes/charts.js";
app.use("/api/charts", chartRoutes);


// ============================
//   START SERVER
// ============================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Backend running on port " + PORT));
