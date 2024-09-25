import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "lib/db";
import { getSession } from "next-auth/react";

export default async function getAllEmails(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { queryPage } = req.body;

  // Pagination
  const perPage = 10;
  const page = queryPage ? parseInt(queryPage, 10) - 1 : 0;

  try {
    const session = await getSession({ req });

    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const db = await dbConnect();

    const emails = await db
      .collection("emails")
      .find({
        userId: new ObjectId(session?.sub)
      })
      .skip(perPage * page)
      .limit(perPage)
      .toArray();

    if (!emails || emails.length === 0) {
      return res.status(200).json({ message: "User has no emails." });
    }

    return res.status(200).json({ Emails: emails });
  } catch (err: any) {
    res.status(500).json({ error: err });
  }
}
