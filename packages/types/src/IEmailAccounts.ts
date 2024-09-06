import { ObjectId } from "mongoose";

type IEmailAccounts = {
  userId: ObjectId;
  email: string;
  provider: string;
  accessToken: string;
  refreshToken: string;
  sentMail: number;
  createdDate: string;
  lastModifiedDate: string;
};

export type { IEmailAccounts };
