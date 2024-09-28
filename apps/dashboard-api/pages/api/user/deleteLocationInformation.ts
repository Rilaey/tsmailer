import { NextApiRequest, NextApiResponse } from "next";
import cors from "../middleware/corsMiddleware";
import dbConnect from "lib/db";
import { getToken } from "next-auth/jwt";
import { pushLogs } from "@repo/utility";
import { ObjectId } from "mongodb";
import { User } from "@repo/models";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  cors(req, res, async () => {
    const token = await getToken({ req });

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const db = await dbConnect();

    if (req.method == "DELETE") {
      const user = await User.findOneAndUpdate(
        { apiKey: token.apiKey },
        {
          $set: {
            street: null,
            city: null,
            zipCode: null,
            state: null,
            lastModifiedDate: new Date().toISOString()
          }
        },
        {
          new: true
        }
      );

      if (!user) {
        return res
          .status(400)
          .json({ error: "Unable to update user information at this time" });
      }

      await pushLogs(
        new ObjectId(token.id as ObjectId),
        "Deleted location information",
        "Success",
        "Account",
        db
      );

      return res.status(200).json({ success: true });
    } else {
      await pushLogs(
        new ObjectId(token.id as ObjectId),
        "Failed to delete location information",
        "Error",
        "Account",
        db
      );

      return res
        .status(200)
        .send("No action performed. Check for correct request method.");
    }
  });
}

// might need this on all api calls to prevent console message of "API resolved without sending a response".
// maybe a global solution?
export const config = {
  api: {
    externalResolver: true
  }
};
