import { NextApiRequest, NextApiResponse } from "next";
import cors from "../middleware/corsMiddleware";
import dbConnect from "lib/db";
import { getToken } from "next-auth/jwt";
import { pushLogs } from "@repo/utility";
import { User } from "@repo/models";
import { ObjectId } from "mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { phoneNumber, street, city, zipCode, state } = req.body;

  cors(req, res, async () => {
    const token = await getToken({ req });

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const db = await dbConnect();

    if (req.method == "PUT") {
      try {
        const user = await User.findOneAndUpdate(
          { apiKey: token.apiKey },
          {
            $set: {
              ...(phoneNumber && { phoneNumber }),
              ...(street && { street }),
              ...(city && { city }),
              ...(zipCode && { zipCode }),
              ...(state && { state }),
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
          "Updated user information",
          "Success",
          "Account",
          db
        );

        return res.status(200).json({ success: true });
      } catch (err) {
        await pushLogs(
          new ObjectId(token.id as ObjectId),
          "Failed to update user information",
          "Error",
          "Account",
          db
        );

        return res.status(500).json({ error: err });
      }
    } else if (req.method == "POST") {
      try {
        if (!street || !city || !zipCode || !state) {
          return res
            .status(400)
            .json({ error: "Street, city, zipcode, and state are required." });
        }

        const user = await User.findOneAndUpdate(
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
          "Updated user information",
          "Success",
          "Account",
          db
        );

        return res.status(200).json({ success: true });
      } catch (err) {
        await pushLogs(
          new ObjectId(token.id as ObjectId),
          "Failed to update user information",
          "Error",
          "Account",
          db
        );

        return res.status(500).json({ error: err });
      }
    } else {
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
