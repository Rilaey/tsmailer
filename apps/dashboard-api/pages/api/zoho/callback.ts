import { NextApiRequest, NextApiResponse } from "next";
import { MongoClient } from "mongodb";
import { getSession } from "next-auth/react";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const code = req.query.code as string;

  if (!code) {
    return res.status(400).send("Missing code");
  }

  const tokenResponse = await fetch(
    "https://accounts.zoho.com/oauth/v2/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        code,
        client_id: process.env.ZOHO_CLIENT_ID as string,
        client_secret: process.env.ZOHO_CLIENT_SECRET as string,
        redirect_uri: `${process.env.NEXTAUTH_URL}/api/zoho/callback` as string,
        grant_type: "authorization_code"
      })
    }
  );

  if (!tokenResponse.ok) {
    throw new Error(`Error fetching access token: ${tokenResponse.statusText}`);
  }

  const tokenData = await tokenResponse.json();

  const accessToken = tokenData.access_token;

  const userInfoResponse = await fetch(
    "https://mail.zoho.com/api/accounts/your_account_id/users/your_user_id",
    {
      method: "GET",
      headers: {
        Authorization: `Zoho-oauthtoken ${accessToken}`,
        "Content-Type": "application/json"
      }
    }
  );

  if (!userInfoResponse.ok) {
    throw new Error(`Error fetching user info: ${userInfoResponse.statusText}`);
  }

  const userInfo = await userInfoResponse.json();

  const clientPromise = MongoClient.connect(process.env.MONGODB_URI as string);
  const db = (await clientPromise).db();

  const currentDate = new Date();

  await db.collection("emailAccounts").insertOne({
    //@ts-ignore
    userId: session.id,
    provider: "Zoho",
    email: userInfo.email,
    accessToken: tokenData.access_token,
    refreshToken: tokenData.refresh_token,
    createdDate: currentDate.toISOString(),
    lastModifiedDate: currentDate.toISOString()
  });

  // Redirect to homepage or desired location
  res.status(200).redirect(`${process.env.NEXTAUTH_URL}/`);
}
