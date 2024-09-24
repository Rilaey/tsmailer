import { getToken } from "next-auth/jwt";
import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "lib/db";

export default async function getOneTemplate(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { templateId } = req.body;

  if (!templateId) {
    return res.status(400).json({ Error: "Template ID is required." });
  }

  const token = await getToken({ req });

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const db = await dbConnect();
  try {
    const template = await db.collection("templates").findOne({ templateId });

    if (!template) {
      return res
        .status(400)
        .json({ Error: "Unable to locate template at this time." });
    }

    res.status(200).json({ Template: template });
  } catch (err: any) {
    res.status(500).json({ Error: err });
  }
}
