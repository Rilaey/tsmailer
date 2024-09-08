import dbConnect from "lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function getAllUserEmailAccounts(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { _id } = req.body;
  try {
    if (!_id) {
      throw new Error("_id is required for getting user's email accounts.");
    }
    const db = await dbConnect();

    const emailAccounts = await db
      .collection("emailaccounts")
      .find({ userId: _id })
      .toArray();

    if (!emailAccounts) {
      throw new Error("Error fetching email account documents for user.");
    }

    res.status(200).json(emailAccounts);
  } catch (err) {
    res.status(500).json(err);
  }
}
