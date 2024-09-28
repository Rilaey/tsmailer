import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "lib/db";
import { getToken } from "next-auth/jwt";
import cors from "../middleware/corsMiddleware";
import { Email } from "@repo/models";

export default async function getAllEmails(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { queryPage } = req.body;

  // Pagination
  const perPage = 10;
  const page = queryPage ? parseInt(queryPage, 10) - 1 : 0;

  cors(req, res, async () => {
    const token = await getToken({ req });

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    await dbConnect();

    try {
      const emails = await Email.find({
        userId: new ObjectId(token.id as ObjectId)
      })
        .skip(perPage * page)
        .limit(perPage);

      if (!emails || emails.length === 0) {
        return res.status(200).json({ message: "User has no emails." });
      }

      return res.status(200).json({ Emails: emails });
    } catch (err) {
      res.status(500).json({ error: err });
    }
  });
}
