import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    console.log("Connecting to:", uri);

    await mongoose.connect(uri, {
      ssl: true,
      tlsAllowInvalidCertificates: true,  
      tlsAllowInvalidHostnames: true,     
    });

    console.log("✅ MongoDB Connected Successfully!");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  }
};
