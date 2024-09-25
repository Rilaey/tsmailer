import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import cors from "../middleware/corsMiddleware";
import dbConnect from "lib/db";
import { pushLogs } from "@repo/utility";

export default async function deletePhoneNumber(
  req: NextApiRequest,
  res: NextApiResponse
) {
  cors(req, res, async () => {
    const token = await getToken({ req });

    if (!token) {
      return res.status(401).json({ Error: "Unauthorized" });
    }

    const db = await dbConnect();

    try {
      const user = await db
        .collection("users")
        .findOne({ apiKey: token.apiKey });

      if (!user) {
        return res
          .status(500)
          .json({ Error: "Unable to delete phone number at this time." });
      }

      await db.collection("users").findOneAndUpdate(
        { apiKey: token.apiKey },
        {
          $set: {
            phoneNumber: null
          }
        },
        {
          returnDocument: "after"
        }
      );

      await pushLogs(
        token.id as string,
        `Deleted phone number`,
        "Success",
        "Account",
        db
      );

      return res.status(200).json({ Success: "Deleted phone number." });
    } catch (err) {
      return res.status(500).json({ error: err });
    }
  });
}
