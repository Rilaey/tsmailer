import { getToken } from "next-auth/jwt";
import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "lib/db";

export default async function getAllLogs(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { queryPage } = req.body;

  // Pagination
  const perPage = 10;
  const page = queryPage ? parseInt(queryPage, 10) - 1 : 0;

  try {
    const token = await getToken({ req });

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const db = await dbConnect();

    const logs = await db
      .collection("logs")
      .find({
        userId: new ObjectId(token.id as string)
      })
      .skip(perPage * page)
      .limit(perPage)
      .toArray();

    if (!logs) {
      throw new Error("User has no logs.");
    }

    if (logs.length == 0) {
      return res.status(200).json({ message: "User has no logs." });
    }

    res.status(200).json({ Logs: logs });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
