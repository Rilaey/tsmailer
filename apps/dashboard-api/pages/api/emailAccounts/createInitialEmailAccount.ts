import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "lib/db";
import {
  generateUniqueId,
  pushLogs,
  validateEmailAccount
} from "@repo/utility";

export default async function addInitialEmailAccount(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email, provider, id, access_token, refresh_token, nickName } =
    req.body;

  if (!id || !provider || !email || !access_token || !refresh_token) {
    return res.status(400).json({
      Error:
        "User ID, provider, email, access token, and refresh token are required."
    });
  }

  const db = await dbConnect();

  try {
    const doesEmailExist = await validateEmailAccount(db, email);

    if (!doesEmailExist) {
      const newEmailAccountDocument = {
        userId: id,
        providerId: `provider_${await generateUniqueId(db, "provider", 32)}`,
        nickName: nickName,
        email: email,
        provider: provider,
        accessToken: access_token,
        refreshToken: refresh_token,
        sentMail: 0,
        createdDate: new Date().toISOString(),
        lastModifiedDate: new Date().toISOString()
      };

      await db.collection("emailaccounts").insertOne(newEmailAccountDocument);

      await pushLogs(
        id,
        `Email account created for ${email}`,
        "Success",
        "Email",
        db
      );

      res.status(200).json("Email account document inserted for new user.");
    } else {
      await pushLogs(
        id,
        `Email account already exist for ${email}`,
        "Warning",
        "Email",
        db
      );

      res.status(202).json("Success. Email document already exists.");
    }
  } catch (err: any) {
    await pushLogs(id, "Failed to create email account", "Error", "Email", db);

    res.status(500).json({ Error: err });
  }
}
