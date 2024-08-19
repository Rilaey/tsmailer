import { NextApiRequest, NextApiResponse } from "next";

export default async function getUserById(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { _id } = req.body;
  try {
    if (!_id) {
      throw new Error("No ID provided to fetch user.");
    }

   

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DEV_ROUTE}api/user/getUserById`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ _id })
      }
    );


    if (!response.ok) {
      throw new Error("Error fetching user by id!");
    }

    const data = await response.json();

    res.status(200).json(data);
  } catch (err: any) {
    res.status(500).json(err);
  }
}
