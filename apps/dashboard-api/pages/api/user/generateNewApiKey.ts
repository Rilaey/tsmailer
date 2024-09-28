import { getToken } from "next-auth/jwt";
import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "lib/db";
import { generateUniqueId, pushLogs } from "@repo/utility";
import { User } from "@repo/models";
import cors from "../middleware/corsMiddleware";

export default async function generateNewApiKey(
  req: NextApiRequest,
  res: NextApiResponse
) {
  cors(req, res, async () => {
    const token = await getToken({ req });

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const db = await dbConnect();

    try {
      const user = await User.findOneAndUpdate(
        { _id: new ObjectId(token.id as ObjectId) },
        { $set: { apiKey: await generateUniqueId(db, "apiKey", 16) } },
        { new: true }
      );

      if (!user) {
        throw new Error("Unable to create new API key at this time.");
      }

      await pushLogs(
        new ObjectId(token.id as ObjectId),
        "Created new api key",
        "Success",
        "Account",
        db
      );

      return res.status(200).json({ apikey: user.apiKey });
    } catch (err) {
      await pushLogs(
        new ObjectId(token.id as ObjectId),
        "Unable to create new API key at this time.",
        "Error",
        "Account",
        db
      );

      return res.status(500).json({ error: err });
    }
  });
}
