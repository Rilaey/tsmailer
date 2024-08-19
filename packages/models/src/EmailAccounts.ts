import { IEmailAccounts } from "@repo/types";
import { Schema, model } from "mongoose";

const emailAccountsSchema = new Schema<IEmailAccounts>({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User"
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
    required: true,
    default: Date.now()
  },
  lastModifiedDate: {
    type: Number,
    required: true,
    default: Date.now()
  }
});

export const EmailAccounts = model("EmailAccounts", emailAccountsSchema);

export default EmailAccounts;
