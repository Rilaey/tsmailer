import { getToken } from "next-auth/jwt";
import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "lib/db";
import { generateUniqueId, pushLogs } from "@repo/utility";

export default async function generateNewApiKey(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = await getToken({ req });

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const db = await dbConnect();

  try {
    const user = await db
      .collection("users")
      .findOneAndUpdate(
        { _id: new ObjectId(token.id as string) },
        { $set: { apiKey: await generateUniqueId(db, "apiKey", 32) } },
        { returnDocument: "after" }
      );

    if (!user) {
      throw new Error("Unable to create new API key at this time.");
    }

    await pushLogs(
      token.id as string,
      "Created new api key",
      "Success",
      "Account",
      db
    );

    res.status(200).json({ apikey: user.apiKey });
  } catch (err: any) {
    await pushLogs(
      token.id as string,
      "Unable to create new API key at this time.",
      "Error",
      "Account",
      db
    );

    res.status(500).json({ Error: err.message });
  }
}
