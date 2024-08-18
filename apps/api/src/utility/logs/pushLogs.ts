import { Logs } from "@repo/models";
import { IVariation, IState } from "@repo/types";
import moment from "moment";

export const pushLogs = async (
  userId: string,
  message: string,
  state: IState,
  variation: IVariation
) => {
  try {
    const log = await Logs.findOneAndUpdate(
      { userId: userId },
      {
        $push: {
          entries: {
            message: message,
            state: state,
            variation: variation,
            date: moment().format("dddd, MMMM Do YYYY, h:mm:ss a")
          }
        }
      },
      {
        new: true
      }
    );

    if (!log) {
      throw new Error("Unable to push logs at this time. Please try again.");
    }
  } catch (err: any) {
    return err.message;
  }
};
