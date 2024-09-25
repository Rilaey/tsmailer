import { ObjectId } from "mongoose";

interface IContact extends Document {
  userId: ObjectId;
  name: string;
  emailAddress: string;
  phoneNumber: string;
  lastSent: string;
  tags: string[];
  createdDate: string;
  lastModifiedDate: string;
}

export type { IContact };
