import { NextApiRequest, NextApiResponse } from "next";
import { google } from "googleapis";
import { getSession } from "next-auth/react";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.NEXT_PUBLIC_DASHBOARD_API_URL}/api/google/callback`
);

export default async function callback(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { code } = req.query;

  if (!code) {
    return res.status(400).send("Missing code");
  }

  const { tokens } = await oauth2Client.getToken(code as string);

  const decodedTokenResponse = await fetch(
    `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokens.access_token}`
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
        userId: session.sub,
        provider: "google",
        email: decodedTokenJson.email,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token
      })
    }
  );

  res.status(200).redirect(`${process.env.NEXTAUTH_URL}/providers`);
}
