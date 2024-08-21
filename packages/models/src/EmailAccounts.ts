import { IEmailAccounts } from "@repo/types";
import { Schema, model } from "mongoose";

const emailAccountsSchema = new Schema<IEmailAccounts>({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  email: {
    type: String,
    required: true
  },
  provider: {
    type: String,
    required: true
  },
  accessToken: {
    type: String,
    required: true
  },
  refreshToken: {
    type: String,
    required: true
  },
  createdDate: {
    type: Number,
    required: true
  },
  lastModifiedDate: {
    type: Number,
    required: true
  }
});

export const EmailAccounts = model("EmailAccounts", emailAccountsSchema);

export default EmailAccounts;
