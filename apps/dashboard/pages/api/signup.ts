import "dotenv/config";
import { NextApiRequest, NextApiResponse } from "next";

export default async function signup(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { name, email, password } = req.body;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DEV_ROUTE}/api/user/createUser`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password })
      }
    );

    if (!response.ok) {
      throw new Error("Errors attempting to create user");
    }

    const data = await response.json();

    res.status(200).json(data);
  } catch (err: any) {
    res.status(500).json(err.message);
  }
}
