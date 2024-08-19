import { NextApiRequest, NextApiResponse } from "next";

export default async function resendEmailVerification(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email } = req.body;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DEV_ROUTE}/api/user/resendEmailVerification`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      }
    );

    if (!response.ok) {
      throw new Error("Error resending verification email. Please try again.");
    }

    const data = await response.json();

    res.status(200).json(data);
  } catch (err: any) {
    res.status(500).json(err.message);
  }
}
