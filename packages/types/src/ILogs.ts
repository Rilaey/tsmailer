import { ObjectId } from "mongoose";

type IState = "Success" | "Error" | "Warning";

type IVariation = "Email" | "Account";

type IEntries = {
  message: string;
  state: IState;
  date: String;
  variation: IVariation;
};

type ILogs = {
  userId: ObjectId;
  entries: IEntries[];
};

export type { ILogs, IVariation, IState };
