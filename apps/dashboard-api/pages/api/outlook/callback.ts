import { MongoClient } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

const OUTLOOK_REDIRECT_URI = `${process.env.NEXTAUTH_URL}/api/outlook/callback`;

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
      "https://login.microsoftonline.com/{tenant}/oauth2/v2.0/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
          client_id: process.env.OUTLOOK_CLIENT_ID ?? "",
          scope: "openid profile email offline_access Mail.Read Mail.Send",
          code: code as string,
          redirect_uri: OUTLOOK_REDIRECT_URI,
          grant_type: "authorization_code",
          client_secret: process.env.OUTLOOK_CLIENT_SECRET ?? ""
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch tokens: ${response.statusText}`);
    }

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

    const clientPromise = MongoClient.connect(
      process.env.MONGODB_URI as string
    );

    const db = (await clientPromise).db();

    const currentDate = new Date();

    await db.collection("emailAccounts").insertOne({
      //@ts-ignore
      userId: session.id,
      provider: "Outlook",
      email: decodedTokenJson.email,
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      createdDate: currentDate.toISOString(),
      lastModifiedDate: currentDate.toISOString()
    });

    res.redirect("/");
  } catch (err) {
    res.status(500).send("Authentication failed");
  }
}
