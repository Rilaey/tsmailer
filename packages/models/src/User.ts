import { Schema, model } from "mongoose";
import { IUser } from "@repo/types";

const userSchema = new Schema<IUser>({
  name: {
    required: true,
    type: String
  },
  email: {
    required: true,
    type: String,
    validate: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,5})+$/,
      "Invalid email format."
    ],
    unique: true
  },
  password: {
    type: String,
    minlength: 8,
    maxlength: 64,
    required: false
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailAccountsId: {
    type: Schema.Types.ObjectId,
    ref: "EmailAccounts"
  },
  logsId: {
    type: Schema.Types.ObjectId,
    ref: "Logs"
  },
  jti: {
    type: String,
    default: null
  }
});

export const User = model<IUser>("User", userSchema);

export default User;
