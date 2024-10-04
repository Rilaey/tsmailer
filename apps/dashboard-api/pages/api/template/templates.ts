import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "lib/db";
import cors from "../middleware/corsMiddleware";
import { Template } from "@repo/models";
import { generateUniqueId, pushLogs } from "@repo/utility";
import { getToken } from "next-auth/jwt";
import { ObjectId } from "mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  cors(req, res, async () => {
    const token = await getToken({ req });

    if (!token) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const db = await dbConnect();
    if (req.method == "GET") {
      try {
        const templates = await Template.find({ userId: token.id as ObjectId });

        if (!templates) {
          return res
            .status(500)
            .json({ success: false, error: "Unable to locate templates" });
        }

        if (templates.length === 0) {
          return res
            .status(200)
            .json({ success: true, message: "User has no templates" });
        }

        return res.status(200).json({ success: true, data: templates });
      } catch (err) {
        return res.status(500).json({ success: false, error: err });
      }
    } else if (req.method == "POST") {
      try {
        const { name, description, subject, content } = req.body;

        if (!name || !description || !subject || !content) {
          return res.status(400).json({
            Error: "Name, description, subject, and content are required."
          });
        }

        const template = await Template.create({
          userId: token.id as ObjectId,
          templateId: await generateUniqueId(db, "template", 16),
          name,
          description,
          subject,
          content,
          totalEmailUsage: 0,
          createdDate: new Date().toUTCString(),
          lastModifiedDate: new Date().toUTCString()
        });

        await pushLogs(
          token.id as ObjectId,
          `Deleted ${template.templateId}`,
          "Success",
          "Template",
          db
        );

        return res.status(200).json({ success: true, data: template });
      } catch (err) {
        await pushLogs(
          token.id as ObjectId,
          "Failed to create template",
          "Error",
          "Template",
          db
        );

        return res.status(500).json({ success: false, error: err });
      }
    } else if (req.method == "PUT") {
      try {
        const { name, description, subject, content, templateId } = req.body;

        if (!templateId) {
          return res
            .status(400)
            .json({ success: false, error: "Template ID is required" });
        }

        const template = await Template.findOneAndUpdate(
          { templateId },
          {
            $set: {
              ...(name && { name }),
              ...(description && { description }),
              ...(subject && { subject }),
              ...(content && { content }),
              lastUpdatedDate: new Date().toUTCString()
            }
          }
        );

        if (!template) {
          return res
            .status(500)
            .json({ success: false, error: "Unable to locate templates" });
        }

        await pushLogs(
          token.id as ObjectId,
          `Updated ${templateId}`,
          "Success",
          "Template",
          db
        );

        return res.status(200).json({ success: true, data: template });
      } catch (err) {
        await pushLogs(
          token.id as ObjectId,
          "Failed to update template",
          "Error",
          "Template",
          db
        );

        return res.status(500).json({ success: false, error: err });
      }
    } else if (req.method == "DELETE") {
      try {
        const { templateId } = req.body;

        if (!templateId) {
          return res
            .status(400)
            .json({ success: false, error: "Template ID is required." });
        }

        const template = await Template.findOneAndDelete({ templateId });

        if (!template) {
          return res
            .status(500)
            .json({ success: false, error: "Unable to locate templates" });
        }

        await pushLogs(
          token.id as ObjectId,
          `Deleted ${templateId}`,
          "Success",
          "Template",
          db
        );

        return res.status(200).json({ success: true, data: template });
      } catch (err) {
        await pushLogs(
          token.id as ObjectId,
          "Failed to delete template",
          "Error",
          "Template",
          db
        );

        return res.status(500).json({ success: false, error: err });
      }
    } else {
      return res.status(200).json({
        success: true,
        message: "No action performed. Check request method."
      });
    }
  });
}
