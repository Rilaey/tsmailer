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
  image: {
    type: String
  },
  createdDate: {
    type: Number,
    default: Date.now()
  },
  lastModifiedDate: {
    type: Number,
    default: Date.now()
  }
});

export const User = model<IUser>("User", userSchema);

export default User;
