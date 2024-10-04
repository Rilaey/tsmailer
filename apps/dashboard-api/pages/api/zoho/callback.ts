import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

export default async function callback(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { code } = req.query;

  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const tokenResponse = await fetch(
    "https://accounts.zoho.com/oauth/v2/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        client_id: process.env.ZOHO_CLIENT_ID as string,
        client_secret: process.env.ZOHO_CLIENT_SECRET as string,
        redirect_uri:
          `${process.env.NEXT_PUBLIC_DASHBOARD_API_URL}/api/zoho/callback` as string,
        grant_type: "authorization_code",
        code: code as string
      }).toString()
    }
  );

  if (!tokenResponse.ok) {
    throw new Error(`Error fetching access token: ${tokenResponse.statusText}`);
  }

  const tokenData = await tokenResponse.json();

  const expiresAt = Date.now() + tokenData.expires_in * 1000;

  // Fetch user information from Zoho
  const userInfoResponse = await fetch(
    "https://accounts.zoho.com/oauth/user/info",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        "Content-Type": "application/json"
      }
    }
  );

  if (!userInfoResponse.ok) {
    return res.status(userInfoResponse.status).json({
      error: `Error fetching user info: ${userInfoResponse.statusText}`
    });
  }

  const userInfo = await userInfoResponse.json();

  const getZohoAccountId = await fetch("https://mail.zoho.com/api/accounts", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Zoho-oauthtoken ${tokenData.access_token}`
    }
  });

  const getZohoAccountIdJson = await getZohoAccountId.json();

  await fetch(
    `${process.env.NEXT_PUBLIC_DASHBOARD_API_URL}/api/emailAccounts/createEmailAccount`,
    {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${session}` // Send the JWT token here
      },
      body: JSON.stringify({
        userId: session.sub,
        provider: "Zoho",
        emailProviderId: getZohoAccountIdJson.data[0].accountId,
        email: userInfo.Email,
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        expiresIn: expiresAt
      })
    }
  );

  res.status(200).redirect(`${process.env.NEXTAUTH_URL}/providers`);
}
