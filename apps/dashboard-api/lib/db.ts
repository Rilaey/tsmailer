import mongoose from "mongoose";

const connection: { isConnected?: number } = {};

const dbConnect = async () => {
  if (connection.isConnected) {
    return mongoose.connection;
  }

  const db = await mongoose.connect(process.env.MONGODB_URI!);

  connection.isConnected = db.connections[0]!.readyState;

  return db.connection;
};

export default dbConnect;
