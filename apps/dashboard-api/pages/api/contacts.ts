import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import cors from "./middleware/corsMiddleware";
import { getToken } from "next-auth/jwt";
import dbConnect from "lib/db";

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
        const contacts = await db
          .collection("contacts")
          .find({ userId: new ObjectId(token.id as ObjectId) })
          .skip(perPage * page)
          .limit(perPage)
          .toArray();

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

        await db.collection("contacts").insertOne({
          userId: new ObjectId(token.id as ObjectId),
          name,
          emailAddress,
          phoneNumber: phoneNumber ?? null,
          lastSent: "Never",
          tags,
          createdDate: new Date().toISOString(),
          lastModifiedDate: new Date().toISOString()
        });

        return res.status(200).json({ success: true });
      } catch (err) {
        return res.status(500).json({ error: err });
      }
      // DELETE
    } else if (req.method == "DELETE") {
      try {
        if (!contactId) {
          return res.status(401).json({ error: "Contact id is required" });
        }

        const deletedContact = await db
          .collection("contacts")
          .findOneAndDelete({ _id: new ObjectId(contactId) });

        if (!deletedContact) {
          return res
            .status(400)
            .json({ error: "Unable to delete contact at this time" });
        }

        return res.status(200).json({ success: true });
      } catch (err) {
        return res.status(500).json({ error: err });
      }
      // UPDATE
    } else if (req.method == "PUT") {
      try {
        if (!contactId) {
          return res.status(401).json({ error: "Contact id is required" });
        }

        await db.collection("contacts").findOneAndUpdate(
          { _id: new ObjectId(contactId) },
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
            returnDocument: "after"
          }
        );

        return res.status(200).json({ success: true });
      } catch (err) {
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
