import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "lib/db";

export default async function createEmailAccount(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId, provider, email, accessToken, refreshToken } = req.body;

  const currentDate = new Date();

  try {
    const db = (await clientPromise).db();

    const emailAccount = await db.collection("emailaccounts").insertOne({
      userId,
      provider,
      email,
      accessToken,
      refreshToken,
      createdDate: currentDate.toISOString(),
      lastModifiedDate: currentDate.toISOString()
    });

    res.status(200).json(emailAccount);
  } catch (err: any) {
    res.status(500).json(err);
  }
}
