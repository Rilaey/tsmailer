import { ObjectId } from "mongoose";

type ITemplate = {
  _id: ObjectId;
  userId: ObjectId;
  name: string;
  description: string;
  subject: string;
  content: string;
};

export type { ITemplate };
