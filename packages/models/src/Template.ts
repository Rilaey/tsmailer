import mongoose, { Schema } from "mongoose";
import { ITemplate } from "@repo/types";

export interface ITemplateDocument extends ITemplate, Document {}

const templateSchema = new Schema<ITemplateDocument>({
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
  totalEmailUsage: {
    type: Number,
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
  (mongoose.models.Template as mongoose.Model<ITemplateDocument>) ||
  mongoose.model("Template", templateSchema);

export default Template;
