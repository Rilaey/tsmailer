type IRole = "Free User" | "Standard User" | "Pro User" | "Admin";

type ITier = "Free" | "Standard" | "Pro" | "Enterprise";

interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  image: string | undefined | null;
  role: IRole[];
  tier: ITier;
  totalSentMail: number;
  monthlySentMail: number;
  resetMonthlyEmailDate: string;
  apiKey: string;
  createdDate: string;
  lastModifiedDate: string;
}

export type { IUser };
