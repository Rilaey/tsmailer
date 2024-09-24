import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import cors from "../middleware/corsMiddleware";
import dbConnect from "lib/db";
import { pushLogs } from "@repo/utility";

export default async function addAddressInformation(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { street, city, zipCode, state } = req.body;

  try {
    cors(req, res, async () => {
      if (!street || !city || !zipCode || !state) {
        return res
          .status(400)
          .json({ Error: "Street, city, zipcode, and state are required." });
      }

      const token = await getToken({ req });

      if (!token) {
        return res.status(400).json({ Error: "Unauthorized" });
      }

      const db = await dbConnect();

      const user = await db.collection("users").findOneAndUpdate(
        { apiKey: token.apiKey },
        {
          $set: {
            street,
            city,
            zipCode,
            state
          }
        },
        {
          returnDocument: "after"
        }
      );

      if (!user) {
        return res.status(500).json({
          Error: "Unable to add user location information at this time."
        });
      }

      await pushLogs(
        token.id as string,
        "Updated location information",
        "Success",
        "Account",
        db
      );

      res.status(200).json({ Success: "Added user location information." });
    });
  } catch (err) {
    res.status(500).json({ Error: err });
  }
}
