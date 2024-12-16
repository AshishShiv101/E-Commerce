import express from 'express';
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;  // Using the PORT from .env file, default to 5000 if not defined

app.use(express.json());  // Middleware to parse incoming JSON requests
app.use(cookieParser()); // Middleware to)
// Mount the authentication routes
app.use("/api/auth", authRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    connectDB();  // Connect to the database when the server starts
});
