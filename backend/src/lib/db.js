import mongoose from "mongoose"

const connectDB = async () => {
    // Skip MongoDB connection if URI is not set or MongoDB is not running
    if (!process.env.MONGODB_URI) {
        console.log("⚠️  MongoDB URI not set. Skipping database connection.");
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log(`✅ MongoDB Connected: ChainForecast Database connected on ${process.env.MONGODB_URI}`);
    } catch (err) {
        console.warn(`⚠️  MongoDB Connection Error: ${err.message}`);
        console.log("⚠️  Continuing without MongoDB. Auth features will be limited.");
        // Don't throw error - allow server to continue without MongoDB
    }
};

export default connectDB;