import { NextApiRequest, NextApiResponse } from "next";
import cors from "../middleware/corsMiddleware";
import { getToken } from "next-auth/jwt";
import dbConnect from "lib/db";
import { pushLogs } from "@repo/utility";

// GET SOME INPUT ON THE WAY THIS IS SETUP
// 1) able to push logs with a user id if failed to delete email account
// 2) try / catch wrapped all in cors middleware
// 3) if token is outside of cors middleware, it throws a cors error

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
      const emailProvider = await db
        .collection("emailaccounts")
        .findOneAndDelete({ providerId });

      if (!emailProvider) {
        return res
          .status(500)
          .json({ Error: "Unable to delete email provider at this time." });
      }

      await pushLogs(
        token.id as string,
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
        token.id as string,
        "Failed to delete email provider",
        "Error",
        "Email",
        db
      );

      return res.status(500).json({ Error: err });
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
