import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

const OUTLOOK_REDIRECT_URI = `${process.env.NEXT_PUBLIC_DASHBOARD_API_URL}/api/outlook/callback`;

export default async function callback(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  const { code } = req.query;

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!code) {
    return res.status(400).send("Missing authorization code");
  }

  try {
    const response = await fetch(
      "https://login.microsoftonline.com/common/oauth2/v2.0/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
          client_id: process.env.OUTLOOK_CLIENT_ID ?? "",
          scope: "openid profile email offline_access Mail.Send User.Read",
          code: code as string,
          redirect_uri: OUTLOOK_REDIRECT_URI,
          grant_type: "authorization_code",
          client_secret: process.env.OUTLOOK_CLIENT_SECRET ?? ""
        }).toString()
      }
    );

    const data = await response.json();

    const decodedTokenResponse = await fetch(
      `https://graph.microsoft.com/v1.0/me`,
      {
        headers: {
          Authorization: `Bearer ${data.access_token}`
        }
      }
    );

    const decodedTokenJson = await decodedTokenResponse.json();

    await fetch(
      `${process.env.NEXT_PUBLIC_DASHBOARD_API_URL}/api/emailAccounts/createEmailAccount`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify({
          userId: session.id,
          provider: "Outlook",
          email: decodedTokenJson.mail,
          accessToken: data.access_token,
          refreshToken: data.refresh_token
        })
      }
    );

    res.redirect(`${process.env.NEXTAUTH_URL}/providers`);
  } catch (err: any) {
    res.status(500).send(`Authentication failed: ${err.message}`);
  }
}
