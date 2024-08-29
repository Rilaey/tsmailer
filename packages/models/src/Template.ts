import { Schema, model } from "mongoose";
import { ITemplate } from "@repo/types";

const templateSchema = new Schema<ITemplate>({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User"
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
  }
});

export const Template = model<ITemplate>("Templates", templateSchema);

export default Template;
