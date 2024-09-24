import { getToken } from "next-auth/jwt";
import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "lib/db";
import { pushLogs } from "@repo/utility";

export default async function updateTemplate(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { templateId, name, description, subject, content } = req.body;

  if (!templateId) {
    return res.status(200).json({ Error: "Template ID is required." });
  }

  const token = await getToken({ req });

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const db = await dbConnect();
  try {
    const template = await db.collection("templates").findOneAndUpdate(
      { templateId },
      {
        $set: {
          ...(name && { name }),
          ...(description && { description }),
          ...(subject && { subject }),
          ...(content && { content }),
          lastModifiedDate: new Date().toISOString()
        }
      },
      {
        returnDocument: "after"
      }
    );

    if (template) {
      await pushLogs(
        token.id as string,
        `Updated ${templateId}`,
        "Success",
        "Template",
        db
      );
    } else {
      return res
        .status(400)
        .json({ Error: "Unable to update template at this time." });
    }

    res.status(200).json({ UpdatedTemplate: template });
  } catch (err: any) {
    await pushLogs(
      token.id as string,
      `Failed to update ${templateId}`,
      "Error",
      "Template",
      db
    );

    res.status(500).json({ Error: err.message });
  }
}
