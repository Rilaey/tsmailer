import { ObjectId } from "mongoose";
import { IMonth } from "./index";

interface IMonthlyEmailData {
  month: IMonth;
  year: string;
  sent: number;
  failed: number;
  apiCalls: number;
}

interface IUserStats {
  userId: ObjectId;
  monthlyEmailData: IMonthlyEmailData;
  totalSentMail: number;
  totalApiCalls: number;
  resetMonthlyEmailDate: string;
  createdDate: string;
  lastModifiedDate: string;
}

export type { IUserStats, IMonthlyEmailData };
