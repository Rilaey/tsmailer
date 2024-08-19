import { ILogs } from "@repo/types";
import { Schema, Types, model } from "mongoose";

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
    type: Number,
    required: true,
    default: Date.now()
  },
  variation: {
    type: String,
    required: true
  }
});

export const Logs = model<ILogs>("Logs", logSchema);

export default Logs;
