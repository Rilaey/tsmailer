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
  }
});

export const User = model("User", userSchema);

export default User;
