import { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const scope =
    'AaaServer.profile.read,ZohoMail.messages.CREATE,ZohoMail.messages.ALL,ZohoMail.accounts.READ'

  const zohoAuthUrl = `https://accounts.zoho.com/oauth/v2/auth?access_type=offline&response_type=code&client_id=${process.env.ZOHO_CLIENT_ID}&scope=${scope}&redirect_uri=${process.env.DASHBOARD_API_URL}/api/zoho/callback`

  // Redirect user to Zoho authorization page
  res.redirect(zohoAuthUrl)
}