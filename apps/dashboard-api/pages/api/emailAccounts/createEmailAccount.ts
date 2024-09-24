import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "lib/db";
import {
  pushLogs,
  validateEmailAccount,
  generateUniqueId
} from "@repo/utility";

export default async function createEmailAccount(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    userId,
    provider,
    email,
    accessToken,
    refreshToken,
    emailProviderId
  } = req.body;

  if (!userId || !provider || !email || !accessToken || !refreshToken) {
    return res.status(400).json({
      Error:
        "User ID, provider, email, access token, and refresh token are required."
    });
  }

  const currentDate = new Date();

  const db = await dbConnect();

  try {
    const doesEmailExist = await validateEmailAccount(db, email);

    if (!doesEmailExist) {
      const emailAccount = await db.collection("emailaccounts").insertOne({
        userId,
        providerId: `provider_${await generateUniqueId(db, "provider", 32)}`,
        provider,
        email,
        accessToken,
        refreshToken,
        emailProviderId: emailProviderId ?? null, // Currently only for zoho
        sentMail: 0,
        createdDate: currentDate.toISOString(),
        lastModifiedDate: currentDate.toISOString()
      });

      await pushLogs(
        userId,
        `Email account created for ${email}`,
        "Success",
        "Email",
        db
      );
      res.status(200).json(emailAccount);
    } else {
      await pushLogs(
        userId,
        `Email account already exist for ${email}`,
        "Warning",
        "Email",
        db
      );

      res.status(202).json({ Success: "Email already exist" });
    }
  } catch (err: any) {
    await pushLogs(
      userId,
      "Failed to create email account",
      "Error",
      "Email",
      db
    );

    res.status(500).json({ Error: err });
  }
}
