import { ObjectId } from "mongoose";

type IStaus = "Sent" | "Queued" | "Failed";

interface IEmail extends Document {
  _id: ObjectId;
  userId: ObjectId;
  to: string[];
  from: string;
  message: string;
  subject: string;
  status: IStaus;
  responseTime: number;
  size: number;
  sentDate: string;
}

export type { IEmail };
