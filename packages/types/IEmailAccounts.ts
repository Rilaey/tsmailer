import { ObjectId } from "mongoose";

type IYahoo = {
  email: string;
  password: string;
  nickName: string;
};

type IEmailAccounts = {
  userId: ObjectId;
  yahoo: IYahoo;
};

export { IEmailAccounts };
