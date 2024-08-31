import { NextApiRequest, NextApiResponse } from "next";
import querystring from "querystring";

const YAHOO_CLIENT_ID = process.env.YAHOO_CLIENT_ID;
const YAHOO_REDIRECT_URI = `${process.env.NEXT_PUBLIC_DASHBOARD_API_URL}/api/yahoo/callback`;

export default function connect(req: NextApiRequest, res: NextApiResponse) {
  const yahooAuthUrl = `https://api.login.yahoo.com/oauth2/request_auth?${querystring.stringify(
    {
      client_id: YAHOO_CLIENT_ID,
      redirect_uri: YAHOO_REDIRECT_URI,
      response_type: "code",
      scope: "openid email profile"
    }
  )}`;

  res.redirect(yahooAuthUrl);
}
