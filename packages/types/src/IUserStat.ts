import { ObjectId } from "mongodb";
import { Month } from "@repo/enums";

interface IMonthlyEmailData {
  _id: ObjectId;
  month: Month;
  year: string;
  sent: number;
  failed: number;
  apiCalls: number;
}

interface IUserStat {
  _id: ObjectId;
  userId: ObjectId;
  monthlyEmailData: IMonthlyEmailData[];
  totalSentMail: number;
  totalApiCalls: number;
  resetMonthlyEmailDate: string;
  createdDate: string;
  lastModifiedDate: string;
}

export type { IUserStat, IMonthlyEmailData };
