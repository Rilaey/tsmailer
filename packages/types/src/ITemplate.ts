import { ObjectId } from "mongoose";

type ITemplate = {
  _id: ObjectId;
  userId: ObjectId;
  templateId: string;
  name: string;
  description: string;
  subject: string;
  content: string;
  totalEmailUsage: number;
  createdDate: string;
  lastModifiedDate: string;
};

export type { ITemplate };
