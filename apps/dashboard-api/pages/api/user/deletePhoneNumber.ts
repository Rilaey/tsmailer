import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import cors from "../middleware/corsMiddleware";
import dbConnect from "lib/db";
import { pushLogs } from "@repo/utility";
import { ObjectId } from "mongodb";
import { User } from "@repo/models";

export default async function deletePhoneNumber(
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
        { apiKey: token.apiKey },
        {
          $set: {
            phoneNumber: null
          }
        },
        {
          new: true
        }
      );

      if (!user) {
        return res
          .status(500)
          .json({ error: "Unable to delete phone number at this time." });
      }

      await pushLogs(
        new ObjectId(token.id as ObjectId),
        `Deleted phone number`,
        "Success",
        "Account",
        db
      );

      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(500).json({ error: err });
    }
  });
}
