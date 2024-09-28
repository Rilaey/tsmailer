import { ILog } from "@repo/types";
import mongoose, { Schema } from "mongoose";

export interface ILogDocument extends ILog, Document {}

const logSchema = new Schema<ILogDocument>({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  emailId: {
    type: Schema.Types.ObjectId,
    ref: "Email"
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

export const Log =
  (mongoose.models.Log as mongoose.Model<ILogDocument>) ||
  mongoose.model("Log", logSchema);

export default Log;
