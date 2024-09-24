import { Connection } from "mongoose";
import { ObjectId } from "mongodb";
import { IVariation, IState } from "@repo/types";

export const pushLogs = async (
  userId: ObjectId | string,
  message: string,
  state: IState,
  variation: IVariation,
  db: Connection,
  emailId: ObjectId | string | null = null
) => {
  try {
    const log = await db.collection("logs").insertOne({
      userId,
      emailId,
      message,
      state,
      variation,
      date: new Date().toISOString()
    });

    if (!log) {
      throw new Error("Unable to push logs at this time. Please try again.");
    }

    return log;
  } catch (err: any) {
    return err.message;
  }
};
