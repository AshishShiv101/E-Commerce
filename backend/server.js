import express from 'express';
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser';
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.routes.js "
import couponRoutes from "./routes/coupon.route.js"
import paymentRoutes from "./routes/payment.route.js"
import analyticsRoutes from "./routes/analytics.route.js"
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;  // Using the PORT from .env file, default to 5000 if not defined

app.use(express.json());  // Middleware to parse incoming JSON requests
app.use(cookieParser()); 
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons",couponRoutes)
app.use("api/payments",paymentRoutes)
app.use("/api/analytics",analyticsRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    connectDB();
});
