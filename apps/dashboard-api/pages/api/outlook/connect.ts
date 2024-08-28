import { NextApiRequest, NextApiResponse } from "next";

const OUTLOOK_AUTH_URL =
  "https://login.microsoftonline.com/common/oauth2/v2.0/authorize";

export default function connect(req: NextApiRequest, res: NextApiResponse) {
  const scope = "openid profile email offline_access Mail.Send User.Read";

  const authUrl = `${OUTLOOK_AUTH_URL}?client_id=${process.env.OUTLOOK_CLIENT_ID}&response_type=code&redirect_uri=${process.env.DASHBOARD_API_URL}/api/outlook/callback&response_mode=query&scope=${encodeURIComponent(scope)}&prompt=consent`;

  res.redirect(authUrl);
}
