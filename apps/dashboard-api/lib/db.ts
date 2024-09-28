import mongoose from "mongoose";

const connection: { isConnected?: number } = {};

// Function to establish a MongoDB connection
const dbConnect = async () => {
  if (connection.isConnected) {
    // Return the existing connection if already connected
    return mongoose.connection;
  }

  // If not connected, establish a new connection
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI!);

    connection.isConnected = db.connections[0]?.readyState;

    console.log(
      "MongoDB Connected:",
      connection.isConnected === 1 ? "Success" : "Failure"
    );

    return db.connection;
  } catch (err) {
    console.error("MongoDB Connection Error:", err);
    throw new Error("Failed to connect to MongoDB");
  }
};

export default dbConnect;
