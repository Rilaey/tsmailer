import { ObjectId } from "mongoose";

type IEmailAccounts = {
  userId: ObjectId;
  providerId: string;
  nickName: string;
  email: string;
  emailProviderId?: string | number;
  provider: string;
  accessToken: string;
  refreshToken: string;
  sentMail: number;
  createdDate: string;
  lastModifiedDate: string;
};

export type { IEmailAccounts };
