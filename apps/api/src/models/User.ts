import { Schema, model } from "mongoose";
import { IUser } from "@packages/types";

const userSchema = new Schema<IUser>({
  firstName: {
    required: true,
    type: String
  },
  lastName: {
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
    required: true,
    type: String,
    minlength: 8,
    maxlength: 64
  }
});

const User = model("User", userSchema);

export default User;
