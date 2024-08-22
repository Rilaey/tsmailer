import "dotenv/config";
import { connect } from "mongoose";

export const connectDatabase = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("Invalid mongo uri!");
    }

    await connect(process.env.MONGODB_URI);
  } catch (err: any) {
    console.error(err.message);
    process.exit(1);
  }
};
