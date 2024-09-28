import { NextApiRequest, NextApiResponse } from "next";
import cors from "../middleware/corsMiddleware";
import { getToken } from "next-auth/jwt";
import dbConnect from "lib/db";
import { pushLogs } from "@repo/utility";
import { EmailAccount } from "@repo/models";
import { ObjectId } from "mongodb";

export default async function deleteEmailAccount(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { providerId } = req.body;

  if (!providerId) {
    return res.status(400).json({ error: "Provider ID is required." });
  }

  cors(req, res, async () => {
    const token = await getToken({ req });

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const db = await dbConnect();

    try {
      const emailProvider = await EmailAccount.findOneAndDelete({ providerId });

      if (!emailProvider) {
        return res
          .status(500)
          .json({ error: "Unable to delete email provider at this time." });
      }

      await pushLogs(
        new ObjectId(token.id as ObjectId),
        `Delete email provider ${emailProvider.providerId}`,
        "Success",
        "Email",
        db
      );

      return res
        .status(200)
        .json({ Success: `Deleted ${emailProvider.providerId}` });
    } catch (err) {
      await pushLogs(
        new ObjectId(token.id as ObjectId),
        "Failed to delete email provider",
        "Error",
        "Email",
        db
      );

      return res.status(500).json({ error: err });
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
