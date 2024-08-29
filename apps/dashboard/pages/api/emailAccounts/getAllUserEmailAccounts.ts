import { NextApiRequest, NextApiResponse } from "next";

export default async function getAllUserEmailAccounts(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { _id, token } = req.body;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DASHBOARD_API_URL}/api/emailAccounts/getAllUserEmailAccounts`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json"
          // TODO -- Need to work this out once endpoint is implemented in the front end.
          //Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ _id })
      }
    );

    const data = await response.json();

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
}
