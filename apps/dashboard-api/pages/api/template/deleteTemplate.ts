import { getToken } from "next-auth/jwt";
import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "lib/db";
import { pushLogs } from "@repo/utility";
import { ObjectId } from "mongodb";
import { Template } from "@repo/models";
import cors from "../middleware/corsMiddleware";

export default async function deleteTemplate(
  req: NextApiRequest,
  res: NextApiResponse
) {
  cors(req, res, async () => {
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
      const template = await Template.findOneAndDelete({ templateId });

      if (template) {
        await pushLogs(
          new ObjectId(token.id as ObjectId),
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

      return res.status(200).json({ success: true });
    } catch (err: any) {
      await pushLogs(
        new ObjectId(token.id as ObjectId),
        `Failed to deleted ${templateId}`,
        "Error",
        "Template",
        db
      );

      return res.status(500).json({ error: err });
    }
  });
}
