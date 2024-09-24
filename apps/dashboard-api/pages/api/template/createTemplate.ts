import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import dbConnect from "lib/db";
import { pushLogs, generateUniqueId } from "@repo/utility";
import cors from "../middleware/corsMiddleware";

export default async function createTemplate(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    cors(req, res, async () => {
      const { name, description, subject, content } = req.body;

      if (!name || !description || !subject || !content) {
        return res.status(400).json({
          Error: "Name, description, subject, and content are required."
        });
      }

      const token = await getToken({ req });

      if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const db = await dbConnect();

      const newTemplate = {
        userId: token.id as string,
        templateId: `template_${await generateUniqueId(db, "template", 32)}`,
        name,
        description,
        subject,
        content,
        totalEmailUsage: 0,
        createdDate: new Date().toISOString(),
        lastModifiedDate: new Date().toISOString()
      };

      await db.collection("templates").insertOne(newTemplate);

      await pushLogs(
        token.id as string,
        "Created new template.",
        "Success",
        "Template",
        db
      );

      return res.status(200).json({ Success: newTemplate });
    });
  } catch (err: any) {
    res.status(500).json({ Error: err.message });
  }
}

// might need this on all api calls to prevent console message of "API resolved without sending a response".
// maybe a global solution?
export const config = {
  api: {
    externalResolver: true
  }
};
