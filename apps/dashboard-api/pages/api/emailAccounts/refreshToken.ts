import { NextApiRequest, NextApiResponse } from "next";
import { EmailAccount } from "@repo/models";

export default async function refreshZohoToken(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { emailAccount } = req.body;

  if (!emailAccount) {
    return res.status(400).json({ error: "Email account is required." });
  }

  // get current date
  const currentDate = Date.now();

  const emailAccountDoc = EmailAccount.hydrate(emailAccount);

  try {
    if (currentDate > emailAccount.expiresIn) {
      const refreshResponse = await fetch(
        "https://accounts.zoho.com/oauth/v2/token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: new URLSearchParams({
            client_id: process.env.ZOHO_CLIENT_ID as string,
            client_secret: process.env.ZOHO_CLIENT_SECRET as string,
            refresh_token: emailAccount.refreshToken,
            grant_type: "refresh_token"
          }).toString()
        }
      );

      if (!refreshResponse.ok) {
        return res
          .status(500)
          .json({ error: "Failed to refresh Zoho access token" });
      }

      const refreshedData = await refreshResponse.json();

      emailAccountDoc.expiresIn = Date.now() + refreshedData.expires_in * 1000;
      emailAccountDoc.accessToken = refreshedData.access_token;
      emailAccountDoc.lastModifiedDate = new Date().toUTCString();

      await emailAccountDoc.save();

      // Save the new access token (and refresh token, if returned)
      return res.status(200).json({
        success: true,
        data: refreshedData,
        message: "Updated tokens"
      });
    } else {
      return res
        .status(200)
        .json({ success: true, message: "Tokens are already up to date" });
    }
  } catch (err) {
    return res.status(500).json({ error: err });
  }
}
