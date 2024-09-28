import mongoose, { Schema } from "mongoose";
import { IContact } from "@repo/types";

export interface IContactDocument extends IContact, Document {}

const contactSchema = new Schema<IContactDocument>({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "user"
  },
  name: {
    type: String,
    required: true
  },
  emailAddress: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String
  },
  lastSent: {
    type: String
  },
  tags: {
    type: [String]
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

export const Contact =
  (mongoose.models.Contact as mongoose.Model<IContactDocument>) ||
  mongoose.model("Contact", contactSchema);

export default Contact;
