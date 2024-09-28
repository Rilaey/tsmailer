import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import cors from "../middleware/corsMiddleware";
import { getToken } from "next-auth/jwt";
import dbConnect from "lib/db";
import { Contact } from "@repo/models";
import { pushLogs } from "@repo/utility";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { queryPage, name, emailAddress, phoneNumber, tags, contactId } =
    req.body;

  // Pagination
  const perPage = 10;
  const page = queryPage ? parseInt(queryPage, 10) - 1 : 0;

  cors(req, res, async () => {
    const token = await getToken({ req });

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const db = await dbConnect();

    // GET
    if (req.method == "GET") {
      try {
        const contacts = await Contact.find({
          userId: token.id as ObjectId
        })
          .skip(perPage * page)
          .limit(perPage);

        if (!contacts) {
          return res
            .status(400)
            .json({ error: "Unable to load contacts at this time" });
        }

        if (contacts.length === 0) {
          return res.status(200).json({ success: "User has no contacts" });
        }

        return res.status(200).json({ success: true, contacts: contacts });
      } catch (err) {
        return res.status(500).json({ error: err });
      }
      // POST
    } else if (req.method == "POST") {
      try {
        if (!name || !emailAddress) {
          return res
            .status(400)
            .json({ error: "Name and email address are required" });
        }

        await Contact.create({
          userId: new ObjectId(token.id as ObjectId),
          name,
          emailAddress,
          phoneNumber: phoneNumber ?? null,
          lastSent: "Never",
          tags,
          createdDate: new Date().toISOString(),
          lastModifiedDate: new Date().toISOString()
        });

        await pushLogs(
          new ObjectId(token.id as ObjectId),
          `Created contact for ${name}`,
          "Success",
          "Contact",
          db
        );

        return res.status(200).json({ success: true });
      } catch (err) {
        await pushLogs(
          new ObjectId(token.id as ObjectId),
          `Failed to create contact for ${name}`,
          "Error",
          "Contact",
          db
        );

        return res.status(500).json({ error: err });
      }
      // DELETE
    } else if (req.method == "DELETE") {
      try {
        if (!contactId) {
          return res.status(401).json({ error: "Contact id is required" });
        }

        const deletedContact = await Contact.findOneAndDelete({
          _id: contactId
        });

        if (!deletedContact) {
          return res
            .status(400)
            .json({ error: "Unable to delete contact at this time" });
        }

        await pushLogs(
          new ObjectId(token.id as ObjectId),
          `Deleted contact for ${deletedContact.name}`,
          "Success",
          "Contact",
          db
        );

        return res.status(200).json({ success: true });
      } catch (err) {
        await pushLogs(
          new ObjectId(token.id as ObjectId),
          `Failed to Deleted contact`,
          "Error",
          "Contact",
          db
        );

        return res.status(500).json({ error: err });
      }
      // UPDATE
    } else if (req.method == "PUT") {
      try {
        if (!contactId) {
          return res.status(401).json({ error: "Contact id is required" });
        }

        const contact = await Contact.findOneAndUpdate(
          { _id: contactId },
          {
            $set: {
              ...(name && { name }),
              ...(emailAddress && { emailAddress }),
              ...(phoneNumber && { phoneNumber }),
              ...(tags && { tags }),
              lastModifiedDate: new Date().toISOString()
            }
          },
          {
            new: true
          }
        );

        if (!contact) {
          return res
            .status(400)
            .json({ error: "Unable to update contact at this time" });
        }

        await pushLogs(
          new ObjectId(token.id as ObjectId),
          `Updated contact for ${contact.name}`,
          "Success",
          "Contact",
          db
        );

        return res.status(200).json({ success: true });
      } catch (err) {
        await pushLogs(
          new ObjectId(token.id as ObjectId),
          `Failed to updated contact`,
          "Success",
          "Contact",
          db
        );

        return res.status(500).json({ error: err });
      }
    }
  });
}

// might need this on all api calls to prevent console message of "API resolved without sending a response".
// maybe a global solution?
export const config = {
  api: {
    externalResolver: true
  }
};
