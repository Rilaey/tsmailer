import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "lib/db";
import { ObjectId as MongoDBObjectId } from "mongodb";
import { generateUniqueId } from "@repo/utility";
import { User, Log, UserStat } from "@repo/models";
import { ObjectId } from "mongoose";

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

    const currentYear = currentDate.toLocaleString("default", {
      year: "numeric"
    });

    const addMonthDate = new Date(
      currentDate.setMonth(currentDate.getMonth() + 1)
    ).toISOString();

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
      createdDate: new Date().toISOString(),
      lastModifiedDate: new Date().toISOString()
    });

    await UserStat.create({
      userId: newUser._id,
      resetMonthlyEmailDate: addMonthDate,
      monthlyEmailData: [
        {
          month: currentMonth,
          year: currentYear,
          sent: 0,
          failed: 0,
          apiCalls: 0
        }
      ],
      totalSentMail: 0,
      totalApiCalls: 0,
      createdDate: new Date().toISOString(),
      lastModifiedDate: new Date().toISOString()
    });

    await Log.create({
      userId: newUser._id,
      message: "Account created",
      state: "Success",
      variation: "Account",
      date: new Date().toISOString()
    });

    res.status(200).json({ ...newUser, id: newUser._id });
  } catch (err) {
    res.status(500).json(err);
  }
}
