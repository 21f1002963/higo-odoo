import mongoose from "mongoose"

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your MongoDB URI to .env.local")
}

const uri = process.env.MONGODB_URI

// Set up mongoose connection
export async function connectToDatabase() {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(uri)
      console.log("MongoDB connected...")
    }
  } catch (err) {
    console.error("MongoDB connection error:", err)
    throw new Error("Failed to connect to database")
  }
}

// Export the mongoose instance for use in other files
export default mongoose
