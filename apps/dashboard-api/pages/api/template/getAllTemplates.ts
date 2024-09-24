import { getToken } from "next-auth/jwt";
import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "lib/db";

export default async function getAllTemplates(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = await getToken({ req });

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const db = await dbConnect();
  try {
    const templates = await db
      .collection("templates")
      .find({ userId: token.id })
      .toArray();

    if (!templates) {
      return res
        .status(400)
        .json({ Error: "Unable to locate templates at this time." });
    }

    if (templates.length == 0) {
      return res.status(200).json({ Success: "User has no templates." });
    }

    return res.status(200).json({ Templates: templates });
  } catch (err: any) {
    res.status(500).json({ Error: err.message });
  }
}
