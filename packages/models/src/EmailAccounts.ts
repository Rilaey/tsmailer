import { IEmailAccounts } from "@repo/types";
import mongoose, { Schema } from "mongoose";

const emailAccountSchema = new Schema<IEmailAccounts>({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  nickName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  provider: {
    type: String,
    required: true
  },
  emailProviderId: {
    type: String || Number
  },
  accessToken: {
    type: String,
    required: true
  },
  refreshToken: {
    type: String,
    required: true
  },
  sentMail: {
    type: Number,
    required: true,
    default: 0
  },
  createdDate: {
    type: String,
    required: true
  },
  lastModifiedDate: {
    type: String,
    required: true
  }
});

export const EmailAccounts =
  mongoose.models.EmailAccounts ||
  mongoose.model("EmailAccounts", emailAccountSchema);

export default EmailAccounts;
