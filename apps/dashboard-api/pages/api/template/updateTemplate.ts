import { getToken } from "next-auth/jwt";
import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "lib/db";
import { pushLogs } from "@repo/utility";
import { Template } from "@repo/models";
import cors from "../middleware/corsMiddleware";
import { ObjectId } from "mongodb";

export default async function updateTemplate(
  req: NextApiRequest,
  res: NextApiResponse
) {
  cors(req, res, async () => {
    const { templateId, name, description, subject, content } = req.body;

    if (!templateId) {
      return res.status(200).json({ error: "Template ID is required." });
    }

    const token = await getToken({ req });

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const db = await dbConnect();

    try {
      const template = await Template.findOneAndUpdate(
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
          new: true
        }
      );

      if (template) {
        await pushLogs(
          new ObjectId(token.id as ObjectId),
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

      return res.status(200).json({ updatedTemplate: template });
    } catch (err) {
      await pushLogs(
        new ObjectId(token.id as ObjectId),
        `Failed to update ${templateId}`,
        "Error",
        "Template",
        db
      );

      return res.status(500).json({ error: err });
    }
  });
}
