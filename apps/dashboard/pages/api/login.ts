import "dotenv/config";
import { NextApiRequest, NextApiResponse } from "next";

export default async function login(req: NextApiRequest, res: NextApiResponse) {
  const { email, password } = req.body;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DEV_ROUTE}/api/user/loginUser`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      }
    );

    if (!response.ok) {
      throw new Error("Error logging user in.");
    }

    const data = await response.json();

    res.status(200).json(data);
  } catch (err: any) {
    res.status(500).json(err.message);
  }
}
