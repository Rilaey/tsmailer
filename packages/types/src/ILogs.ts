import { ObjectId } from "mongoose";

type IState = "Success" | "Error" | "Warning";

type IVariation = "Email" | "Account" | "Template";

type ILogs = {
  userId: ObjectId;
  emailId: ObjectId;
  message: string;
  state: IState;
  date: string;
  variation: IVariation;
};

export type { ILogs, IVariation, IState };
