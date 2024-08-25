import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const scope = "ZohoMail.messages.READ,ZohoMail.messages.CREATE"; // Adjust scopes as needed

  const zohoAuthUrl = `https://accounts.zoho.com/oauth/v2/auth?scope=${encodeURIComponent(
    scope
  )}&client_id=${process.env.ZOHO_CLIENT_ID}&redirect_uri=${encodeURIComponent(
    `${process.env.NEXT_PUBLIC_DASHBOARD_API_URL}/api/zoho/callback`
  )}&response_type=code`;

  // Redirect user to Zoho authorization page
  res.redirect(zohoAuthUrl);
}
