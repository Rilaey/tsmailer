import { NextApiRequest, NextApiResponse } from "next";

const YAHOO_CLIENT_ID = process.env.YAHOO_CLIENT_ID;
const YAHOO_CLIENT_SECRET = process.env.YAHOO_CLIENT_SECRET;
const YAHOO_REDIRECT_URI = `${process.env.NEXTAUTH_URL}/api/yahoo/callback`;

export default async function callback(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { code } = req.query;

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
    const { access_token, refresh_token } = data;

    // Save the tokens to the database
    // Example: await saveTokensToDB(userId, { access_token, refresh_token });

    res.redirect("/dashboard"); // Redirect to the dashboard or any other page
  } catch (error) {
    console.error("Error handling Yahoo callback:", error);
    res.status(500).send("Authentication failed");
  }
}
