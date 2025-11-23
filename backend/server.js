import express from "express";
import connectDB from "./src/lib/db.js";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./src/routes/authRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Middlewares
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);

// Start server
const startServer = async () => {
    const port = PORT || 5000;
    app.listen(port, () => {
        console.log(`✅ Backend server running on http://localhost:${port}`);
        console.log(`📡 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
        console.log(`🤖 ML Server URL: ${process.env.FASTAPI_URL || 'http://localhost:8000'}`);
        connectDB();
    });
};

startServer();
