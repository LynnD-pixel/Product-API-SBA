import express from "express";
import 'dotenv/config';
import connectDB from "./db/connection.js";
import productRoutes from "./routes/productRoutes.js";


const app = express();
const PORT = process.env.PORT || 3000;

// Connect to database
connectDB();
// middlware
app.use(express.json());

// Routes
app.use("/api/products", productRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Product API is running");
});

// Start server
app.listen(PORT, () => {
  console.log("Server is running on port:" + PORT);
});