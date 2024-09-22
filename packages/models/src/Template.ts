import mongoose, { Schema, model } from "mongoose";
import { ITemplate } from "@repo/types";

const templateSchema = new Schema<ITemplate>({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  templateId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
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

export const Template =
  mongoose.models.Template ||
  mongoose.model<ITemplate>("Template", templateSchema);

export default Template;
