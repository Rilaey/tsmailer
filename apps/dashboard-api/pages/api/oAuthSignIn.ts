import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "lib/db";
import { ObjectId as MongoDBObjectId } from "mongodb";

export default async function oAuthSignIn(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { user } = req.body;
  try {
    const db = (await clientPromise).db();

    const newUser = {
      ...user,
      _id: new MongoDBObjectId(),
      role: ["Free User"],
      tier: "Free",
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
