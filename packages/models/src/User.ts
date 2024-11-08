import mongoose, { Schema } from "mongoose";
import { IUser } from "@repo/types";

export interface IUserDocument extends IUser, Document {}

const userSchema = new Schema<IUserDocument>({
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
  role: {
    type: [String],
    default: ["Free User"]
  },
  tier: {
    type: String,
    default: "Free"
  },
  apiKey: {
    type: String,
    required: true
  },
  street: {
    type: String,
    default: null
  },
  city: {
    type: String,
    default: null
  },
  zipCode: {
    type: Number,
    default: null
  },
  state: {
    type: String,
    default: null
  },
  phoneNumber: {
    type: Number,
    default: null
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

export const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
