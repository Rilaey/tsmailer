import { ObjectId } from "mongoose";

type IState = "Success" | "Error" | "Warning";

type IVariation = "Email" | "Account";

type ILogs = {
  userId: ObjectId;
  message: string;
  state: IState;
  date: number;
  variation: IVariation;
};

export type { ILogs, IVariation, IState };
