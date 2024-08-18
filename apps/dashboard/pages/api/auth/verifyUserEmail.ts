import "dotenv/config";
import { NextApiRequest, NextApiResponse } from "next";

export default async function verifyUserEmail(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email, jti } = req.body;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DEV_ROUTE}/api/user/verifyUserEmail`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, jti })
      }
    );

    if (!response.ok) {
      throw new Error("Unable to locate user to verify email address.");
    }

    const data = await response.json();

    res.status(200).json(data);
  } catch (err: any) {
    res.status(500).json(err.message);
  }
}
