import { getToken } from "next-auth/jwt";
import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "lib/db";
import { pushLogs } from "@repo/utility";

export default async function deleteTemplate(
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
    const template = await db
      .collection("templates")
      .findOneAndDelete({ templateId });

    if (template) {
      await pushLogs(
        token.id as string,
        `Deleted ${templateId}`,
        "Success",
        "Template",
        db
      );
    } else {
      return res
        .status(400)
        .json({ Error: "Unable to delete template at this time." });
    }

    res.status(200).json({ DeletedTemplate: template });
  } catch (err: any) {
    await pushLogs(
      token.id as string,
      `Failed to deleted ${templateId}`,
      "Error",
      "Template",
      db
    );

    res.status(500).json({ Error: err.message });
  }
}
