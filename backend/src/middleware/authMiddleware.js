import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const protectRoute = async (req, res, next) => {
  try {
    // Check if MongoDB is connected
    const mongoose = (await import("mongoose")).default;
    if (mongoose.connection.readyState !== 1) {
      // MongoDB not connected - skip auth (for development)
      console.log("⚠️  MongoDB not connected. Auth middleware skipped.");
      return next();
    }

    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No Token Provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;

    next();
  } catch (error) {
    console.log("Error in protectRoute middleware: ", error.message);
    // If it's a MongoDB error, skip auth
    if (error.message.includes("MongoServerError") || error.message.includes("connection")) {
      console.log("⚠️  MongoDB error. Skipping auth.");
      return next();
    }
    res.status(500).json({ message: "Internal server error" });
  }
};