import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

const YAHOO_CLIENT_ID = process.env.YAHOO_CLIENT_ID;
const YAHOO_CLIENT_SECRET = process.env.YAHOO_CLIENT_SECRET;
const YAHOO_REDIRECT_URI = `${process.env.DASHBOARD_API_URL}/api/yahoo/callback`;

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
      "https://api.login.yahoo.com/oauth2/get_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
          code: code as string,
          redirect_uri: YAHOO_REDIRECT_URI,
          client_id: YAHOO_CLIENT_ID as string,
          client_secret: YAHOO_CLIENT_SECRET as string,
          grant_type: "authorization_code"
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch tokens: ${response.statusText}`);
    }

    const data = await response.json();

    const decodedTokenResponse = await fetch(
      `https://api.login.yahoo.com/openid/v1/userinfo`,
      {
        headers: {
          Authorization: `Bearer ${data.access_token}`
        }
      }
    );

    const decodedTokenJson = await decodedTokenResponse.json();

    await fetch(
      `${process.env.NEXT_PUBLIC_DASHBOARD_DB_URL}/api/emailAccounts/createEmailAccount`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify({
          userId: session.id,
          provider: "Yahoo",
          email: decodedTokenJson.email,
          accessToken: data.access_token,
          refreshToken: data.refresh_token
        })
      }
    );

    res.redirect(`${process.env.NEXTAUTH_URL}/`);
  } catch (error) {
    res.status(500).send("Authentication failed");
  }
}
