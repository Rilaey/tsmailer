import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { EmailAccount } from "@repo/models";
import cors from "../middleware/corsMiddleware";
import dbConnect from "lib/db";

export default async function getAllUserEmailAccounts(
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
      const emailAccounts = await EmailAccount.find({
        userId: new ObjectId(token.id as ObjectId)
      });

      if (!emailAccounts) {
        return res
          .status(400)
          .json({ error: "Error fetching email account documents for user." });
      }

      if (emailAccounts.length == 0) {
        return res.status(200).json({ message: "User has no email accounts." });
      }

      return res.status(200).json({ providers: emailAccounts });
    } catch (err) {
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
