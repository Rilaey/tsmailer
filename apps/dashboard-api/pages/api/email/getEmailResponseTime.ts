import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "lib/db";
import cors from "../middleware/corsMiddleware";
import { getToken } from "next-auth/jwt";
import { Email } from "@repo/models";
import { ObjectId } from "mongodb";

export default async function getEmailResponseTime(
  req: NextApiRequest,
  res: NextApiResponse
) {
  cors(req, res, async () => {
    const token = await getToken({ req });

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    await dbConnect();
    try {
      const emails = await Email.find({
        userId: token.id as ObjectId
      });

      if (!emails) {
        return res
          .status(400)
          .json({ error: "Unable to locate email response times" });
      }

      const emailResponseData = [];

      if (emails.length == 0) {
        return res
          .status(200)
          .json({ success: true, message: "User has no emails." });
      } else {
        for (let i = 0; i < emails.length; i++) {
          let newResponseObject = {
            time: emails[i]!.responseTime,
            date: emails[i]!.sentDate,
            error: emails[i]!.status == "Sent" ? "false" : "true"
          };

          emailResponseData.push(newResponseObject);
        }
      }

      return res
        .status(200)
        .json({ success: true, responseData: emailResponseData });
    } catch (err) {
      console.log("error", err);
      return res.status(200).json({ success: false, error: err });
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
