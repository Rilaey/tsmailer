import { IEmail } from "@repo/types";
import mongoose, { Schema, model } from "mongoose";

const emailSchema = new Schema<IEmail>({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  templateId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Template"
  },
  to: {
    type: [String],
    required: true
  },
  from: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  subject: {
    type: String
  },
  status: {
    type: String,
    required: true
  },
  responseTime: {
    type: Number,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  sentDate: {
    type: String,
    required: true
  }
});

export const Email =
  mongoose.models.Email || mongoose.model("Email", emailSchema);

export default Email;
