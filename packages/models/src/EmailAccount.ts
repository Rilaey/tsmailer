import { IEmailAccount } from "@repo/types";
import mongoose, { Schema } from "mongoose";

export interface IEmailAccountDocument extends IEmailAccount, Document {}

const emailAccountSchema = new Schema<IEmailAccountDocument>({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  providerId: {
    type: String,
    required: true
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

export const EmailAccount =
  (mongoose.models.EmailAccount as mongoose.Model<IEmailAccountDocument>) ||
  mongoose.model("EmailAccount", emailAccountSchema);

export default EmailAccount;
