import { Types } from "mongoose";

type IUser = {
  _id: string;
  name: string;
  email: string;
  password: string | undefined | null;
  image: string | undefined | null;
  expires: string | undefined | null;
  isEmailVerified: boolean;
  emailAccountsId: Types.ObjectId;
  logsId: Types.ObjectId;
  jti: string | null;
};

export type { IUser };
