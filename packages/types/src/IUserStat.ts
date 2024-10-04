import { ObjectId } from "mongodb";

interface IWeeklyEmailData {
  _id: ObjectId;
  week: number;
  sent: number;
  failed: number;
  apiCalls: number;
  createdDate: string;
  resetDate: string;
}

interface IMonthlyEmailData {
  _id: ObjectId;
  month: string;
  year: string;
  sent: number;
  failed: number;
  apiCalls: number;
  createdDate: string;
  resetDate: string;
}

interface IUserStat {
  _id: ObjectId;
  userId: ObjectId;
  weeklyEmailData: IWeeklyEmailData[];
  monthlyEmailData: IMonthlyEmailData[];
  totalSentMail: number;
  totalApiCalls: number;
  createdDate: string;
  lastModifiedDate: string;
}

export type { IUserStat, IMonthlyEmailData };
