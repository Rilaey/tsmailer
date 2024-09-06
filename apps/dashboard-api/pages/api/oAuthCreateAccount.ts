import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "lib/db";
import { ObjectId as MongoDBObjectId } from "mongodb";
import { generateUniqueApiKey } from "@repo/utility";

export default async function oAuthSignIn(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { user } = req.body;
  try {
    const db = await dbConnect();

    let currentDate = new Date();

    const addMonthDate = new Date(
      currentDate.setMonth(currentDate.getMonth() + 1)
    ).toISOString();

    const newUser = {
      ...user,
      _id: new MongoDBObjectId(),
      role: ["Free User"],
      tier: "Free",
      apiKey: await generateUniqueApiKey(32, db),
      resetMonthlyEmailDate: addMonthDate,
      totalSentMail: 0,
      monthlySentMail: 0,
      createdDate: new Date().toISOString(),
      lastModifiedDate: new Date().toISOString()
    };

    const newLogsObject = {
      _id: new MongoDBObjectId(),
      userId: newUser._id,
      message: "Account created.",
      state: "Success",
      variation: "Account"
    };

    await db.collection("users").insertOne(newUser);

    await db.collection("logs").insertOne(newLogsObject);

    res.status(200).json({ ...newUser, id: newUser._id.toString() });
  } catch (err) {
    res.status(500).json(err);
  }
}