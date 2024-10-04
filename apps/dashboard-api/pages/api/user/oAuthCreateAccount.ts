import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "lib/db";
import {
  generateUniqueId,
  getLastDayOfMonth,
  getLastDayOfWeek
} from "@repo/utility";
import { User, Log, UserStat } from "@repo/models";

export default async function oAuthSignIn(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { user } = req.body;
  try {
    const db = await dbConnect();

    let currentDate = new Date();

    // get current month
    const currentMonth = currentDate.toLocaleString("default", {
      month: "long"
    });

    // get current year
    const currentYear = currentDate.toLocaleString("default", {
      year: "numeric"
    });

    // add month for monthly tracking
    const addMonthDate = new Date(
      currentDate.setMonth(currentDate.getMonth() + 1)
    ).toUTCString();

    const newUser = await User.create({
      ...user,
      role: ["Free User"],
      tier: "Free",
      apiKey: await generateUniqueId(db, "apiKey", 16),
      street: null,
      city: null,
      zipCode: null,
      state: null,
      phoneNumber: null,
      ipWhitelist: null,
      ipBlacklist: null,
      createdDate: new Date().toUTCString(),
      lastModifiedDate: new Date().toUTCString()
    });

    await UserStat.create({
      userId: newUser._id,
      resetMonthlyEmailDate: addMonthDate,
      weeklyEmailData: [
        {
          week: 1,
          sent: 0,
          failed: 0,
          apiCalls: 0,
          createdDate: new Date().toUTCString(),
          resetDate: getLastDayOfWeek()
        }
      ],
      monthlyEmailData: [
        {
          month: currentMonth,
          year: currentYear,
          sent: 0,
          failed: 0,
          apiCalls: 0,
          createdDate: new Date().toUTCString(),
          resetDate: getLastDayOfMonth()
        }
      ],
      totalSentMail: 0,
      totalApiCalls: 0,
      createdDate: new Date().toUTCString(),
      lastModifiedDate: new Date().toUTCString()
    });

    await Log.create({
      userId: newUser._id,
      message: "Account created",
      state: "Success",
      variation: "Account",
      date: new Date().toUTCString()
    });

    res.status(200).json({ ...newUser, id: newUser._id });
  } catch (err) {
    console.log("ERROR", err);
    res.status(500).json(err);
  }
}
