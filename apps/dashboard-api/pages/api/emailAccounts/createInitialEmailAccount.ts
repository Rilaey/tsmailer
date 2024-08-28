import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "lib/db";

export default async function addInitialEmailAccount(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email, provider, id, access_token, refresh_token } = req.body;

  try {
    const db = (await clientPromise).db();

    const emailAccountDocument = await db
      .collection("emailaccounts")
      .findOne({ email: email });

    if (emailAccountDocument == null) {
      const newEmailAccountDocument = {
        userId: id,
        email: email,
        provider: provider,
        accessToken: access_token,
        refreshToken: refresh_token,
        createdDate: new Date().toISOString(),
        lastModifiedDate: new Date().toISOString()
      };

      await db.collection("emailaccounts").insertOne(newEmailAccountDocument);

      res.status(200).json("Email account document inserted for new user.");
    }

    res.status(200).json("Success. Email document already exists.");
  } catch (err: any) {
    res.status(500).json(err);
  }
}
