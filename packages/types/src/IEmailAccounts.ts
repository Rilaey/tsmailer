import { ObjectId } from "mongoose";

type IEmailAccounts = {
  userId: ObjectId;
  email: string;
  provider: string;
  accessToken: string;
  refreshToken: string;
  createdDate: number;
  lastModifiedDate: number;
};

export type { IEmailAccounts };
