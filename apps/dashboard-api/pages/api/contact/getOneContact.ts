import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import cors from "../middleware/corsMiddleware";
import { getToken } from "next-auth/jwt";
import dbConnect from "lib/db";
import { Contact } from "@repo/models";

export default async function getOneContact(
  req: NextApiRequest,
  res: NextApiResponse
) {
  cors(req, res, async () => {
    const { contactId } = req.body;

    if (!contactId) {
      return res.status(400).json({ error: "Contact ID is required" });
    }

    const token = await getToken({ req });

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    await dbConnect();

    try {
      const contact = await Contact.findOne({
        _id: new ObjectId(contactId as ObjectId)
      });

      if (!contact) {
        return res.status(400).json({ error: "Unable to locate contact" });
      }

      return res.status(200).json({ contact: contact });
    } catch (err) {
      return res.status(500).json({ error: err });
    }
  });
}
