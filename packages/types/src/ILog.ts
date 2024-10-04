import { ObjectId } from "mongoose";

type IState = "Success" | "Error" | "Warning";

type IVariation =
  | "Email"
  | "Account"
  | "Template"
  | "Contact"
  | "Account Stats";

type ILog = {
  _id: ObjectId;
  userId: ObjectId;
  emailId: ObjectId;
  message: string;
  state: IState;
  date: string;
  variation: IVariation;
};

export type { ILog, IVariation, IState };
