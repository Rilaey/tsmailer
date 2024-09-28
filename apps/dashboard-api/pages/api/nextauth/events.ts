import { NextApiRequest, NextApiResponse } from "next";
import cors from "../middleware/corsMiddleware";
import dbConnect from "lib/db";
import { pushLogs } from "@repo/utility";
import { ObjectId } from "mongodb";

export default async function events(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { event, id } = req.body;

  console.log("ID BODY", id);

  if (!event || !id) {
    return res.status(400).json({ error: "Event and user id are required." });
  }

  cors(req, res, async () => {
    try {
      const db = await dbConnect();

      switch (event) {
        case "signOut":
          await pushLogs(
            new ObjectId(id as ObjectId),
            "User sign out",
            "Success",
            "Account",
            db
          );

          res.status(200).json({ success: "User sign out" });

          break;
        case "signIn":
          await pushLogs(
            new ObjectId(id as ObjectId),
            "User sign in",
            "Success",
            "Account",
            db
          );

          res.status(200).json({ success: "User sign in" });

          break;
        default:
          res
            .status(500)
            .json({ error: "Unable to process event at this time." });

          break;
      }
    } catch (err) {
      res.status(500).json({ error: err });
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
