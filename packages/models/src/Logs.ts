import { ILogs } from "@repo/types";
import mongoose, { Schema, model } from "mongoose";

const logSchema = new Schema<ILogs>({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  message: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  variation: {
    type: String,
    required: true
  }
});

export const Logs = mongoose.models.Logs || mongoose.model("Logs", logSchema);

export default Logs;
