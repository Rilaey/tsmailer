import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import cors from "../middleware/corsMiddleware";
import dbConnect from "lib/db";
import { pushLogs } from "@repo/utility";

export default async function updatePhoneNumber(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { phoneNumber } = req.body;

  try {
    cors(req, res, async () => {
      if (!phoneNumber) {
        return res.status(400).json({ Error: "Phone number is required." });
      }

      if (!phoneNumber.match(/^\d{3}-\d{3}-\d{4}$/g)) {
        return res
          .status(400)
          .json({ Error: "Phone number is in incorrect format." });
      }

      const token = await getToken({ req });

      if (!token) {
        return res.status(401).json({ Error: "Unauthorized" });
      }

      const db = await dbConnect();

      const user = await db.collection("users").findOneAndUpdate(
        { apiKey: token.apiKey },
        {
          $set: {
            phoneNumber
          }
        },
        {
          returnDocument: "after"
        }
      );

      if (!user) {
        return res
          .status(500)
          .json({ Error: "Unable to add phone number at this time." });
      }

      await pushLogs(
        token.id as string,
        `Added phone number ${phoneNumber}`,
        "Success",
        "Account",
        db
      );

      res.status(200).json({ Success: "Updated phone number." });
    });
  } catch (err) {
    res.status(500).json({ Error: err });
  }
}

// might need this on all api calls to prevent console message of "API resolved without sending a response".
// maybe a global solution?
export const config = {
  api: {
    externalResolver: true
  }
};
