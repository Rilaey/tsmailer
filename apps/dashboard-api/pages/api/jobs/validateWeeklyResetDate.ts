import { pushLogs, getLastDayOfWeek } from "@repo/utility";
import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "lib/db";
import { UserStat } from "@repo/models";
import { ObjectId } from "mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const db = await dbConnect();

    const userStats = await UserStat.find({});

    if (!userStats) {
      return res
        .status(500)
        .json({ success: false, error: "Unable to locate user stats" });
    }

    let currentDate = new Date();

    let resetDateWeekly = new Date();
    resetDateWeekly.setUTCDate(resetDateWeekly.getUTCDate() + 7);

    let resetDateMonthly = new Date();
    resetDateMonthly.setUTCMonth(resetDateMonthly.getUTCMonth() + 1);

    for (let i = 0; i < userStats.length; i++) {
      let weeklyEmailData =
        userStats[i]?.weeklyEmailData[userStats[i]!.weeklyEmailData.length - 1];

      if (currentDate > new Date(weeklyEmailData!.resetDate)) {
        console.log(userStats[i]!.weeklyEmailData!.length);
        const newWeeklyEmailDataObj = {
          _id: new ObjectId(),
          week: (userStats[i]!.weeklyEmailData!.length += 1),
          sent: 0,
          failed: 0,
          apiCalls: 0,
          createdDate: currentDate.toUTCString(),
          resetDate: getLastDayOfWeek()
        };

        userStats[i]?.weeklyEmailData.push(newWeeklyEmailDataObj);

        await userStats[i]?.save();

        await pushLogs(
          userStats[i]!.userId,
          "Weekly data reset",
          "Success",
          "Account Stats",
          db
        );
      }
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, error: err });
  }
}
