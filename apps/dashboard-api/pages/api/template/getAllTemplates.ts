import { getToken } from "next-auth/jwt";
import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "lib/db";
import { Template } from "@repo/models";
import cors from "../middleware/corsMiddleware";
import { ObjectId } from "mongodb";

export default async function getAllTemplates(
  req: NextApiRequest,
  res: NextApiResponse
) {
  cors(req, res, async () => {
    const token = await getToken({ req });

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    await dbConnect();

    try {
      const templates = await Template.find({
        userId: new ObjectId(token.id as ObjectId)
      });

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
      return res.status(500).json({ error: err });
    }
  });
}
