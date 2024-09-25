import { ObjectId } from "mongodb";
import dbConnect from "lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

export default async function getAllUserEmailAccounts(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const token = await getToken({ req });

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const db = await dbConnect();

    const emailAccounts = await db
      .collection("emailaccounts")
      .find({ userId: new ObjectId(token.id as string) })
      .toArray();

    if (!emailAccounts) {
      throw new Error("Error fetching email account documents for user.");
    }

    if (emailAccounts.length == 0) {
      return res.status(200).json({ message: "User has no email accounts." });
    }

    res.status(200).json(emailAccounts);
  } catch (err) {
    res.status(500).json({ error: err });
  }
}
