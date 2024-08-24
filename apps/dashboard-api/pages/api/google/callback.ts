import { NextApiRequest, NextApiResponse } from "next";
import { google } from "googleapis";
import { getSession } from "next-auth/react";
import { MongoClient } from "mongodb";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.NEXTAUTH_URL}/api/google/callback`
);

export default async function callback(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // const session = await getSession({ req });

  // if (!session) {
  //   return res.status(401).json({ error: "Unauthorized" });
  // }

  const { code } = req.query;

  if (!code) {
    return res.status(400).send("Missing code");
  }

  const { tokens } = await oauth2Client.getToken(code as string);

  const decodedTokenResponse = await fetch(
    `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokens.access_token}`
  );

  const decodedTokenJson = await decodedTokenResponse.json();

  const clientPromise = MongoClient.connect(process.env.MONGODB_URI as string);

  const db = (await clientPromise).db();

  const currentDate = new Date();

  await db.collection("emailAccounts").insertOne({
    //@ts-ignore
    userId: session.id,
    provider: "Gmail",
    email: decodedTokenJson.email,
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
    createdDate: currentDate.toISOString(),
    lastModifiedDate: currentDate.toISOString()
  });

  res.status(200).redirect("/");
}
