import { pushLogs, getLastDayOfMonth, getLastDayOfWeek } from "@repo/utility";
import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "lib/db";
import { UserStat } from "@repo/models";
import { ObjectId } from "mongodb";
import { MONTHS } from "../../../constant/months";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    let currentDate = new Date();

    // only run if first day of the next month is tomorrow
    const tomorrow = new Date(currentDate);
    tomorrow.setDate(currentDate.getDate() + 1);

    if (tomorrow.getDate() === 1) {
      const db = await dbConnect();

      const userStats = await UserStat.find({});

      if (!userStats) {
        return res
          .status(500)
          .json({ success: false, error: "Unable to locate user stats" });
      }

      let resetDateMonthly = new Date();
      resetDateMonthly.setUTCMonth(resetDateMonthly.getUTCMonth() + 1);

      for (let i = 0; i < userStats.length; i++) {
        let monthlyEmailData =
          userStats[i]?.monthlyEmailData[
            userStats[i]!.monthlyEmailData.length - 1
          ];

        if (currentDate > new Date(monthlyEmailData!.resetDate)) {
          const newMonthlyEmailDataObj = {
            _id: new ObjectId(),
            month: MONTHS[resetDateMonthly.getMonth()] ?? "",
            year: resetDateMonthly.getFullYear().toString(),
            sent: 0,
            failed: 0,
            apiCalls: 0,
            createdDate: currentDate.toUTCString(),
            resetDate: getLastDayOfMonth()
          };

          userStats[i]!.monthlyEmailData!.push(newMonthlyEmailDataObj);

          await userStats[i]!.save();

          await pushLogs(
            userStats[i]!.userId,
            "Monthly data reset",
            "Success",
            "Account Stats",
            db
          );
        }
      }
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, error: err });
  }
}
