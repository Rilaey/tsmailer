import { getToken } from "next-auth/jwt";
import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "lib/db";
import { Template } from "@repo/models";
import cors from "../middleware/corsMiddleware";

export default async function getOneTemplate(
  req: NextApiRequest,
  res: NextApiResponse
) {
  cors(req, res, async () => {
    const { templateId } = req.query;

    if (!templateId) {
      return res.status(400).json({ error: "Template ID is required." });
    }

    const token = await getToken({ req });

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    await dbConnect();

    try {
      const template = await Template.findOne({ templateId });

      if (!template) {
        return res
          .status(400)
          .json({ Error: "Unable to locate template at this time." });
      }

      return res.status(200).json({ template: template });
    } catch (err: any) {
      return res.status(500).json({ error: err });
    }
  });
}
