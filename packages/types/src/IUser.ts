import { IMonth } from "./index";

type IRole = "Free User" | "Standard User" | "Pro User" | "Admin";

type ITier = "Free" | "Standard" | "Pro" | "Enterprise";

interface IMonthlyEmailData {
  month: IMonth;
  year: string;
  sent: number;
  failed: number;
}

interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  image: string | undefined | null;
  role: IRole[];
  tier: ITier;
  monthlyEmailData: IMonthlyEmailData;
  totalSentMail: number;
  totalApiCalls: number;
  resetMonthlyEmailDate: string;
  apiKey: string;
  createdDate: string;
  lastModifiedDate: string;
}

export type { IUser, IMonthlyEmailData };
