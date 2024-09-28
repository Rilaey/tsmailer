import { ObjectId } from "mongoose";

type IEmailAccount = {
  _id: ObjectId;
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

export type { IEmailAccount };
