import { ILogs } from "@repo/types";
import { Schema, Types, model } from "mongoose";

const logSchema = new Schema<ILogs>({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  entries: [
    {
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
    }
  ]
});

export const Logs = model("logs", logSchema);

export default Logs;
