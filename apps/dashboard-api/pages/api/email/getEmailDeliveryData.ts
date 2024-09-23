import { getToken } from "next-auth/jwt";
import { ObjectId } from "mongodb";
import { IMonthlyEmailData } from "@repo/types";
import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "lib/db";

export default async function getEmailDeliveryData(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = await getToken({ req });

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const db = await dbConnect();

  try {
    const userStats = await db
      .collection("userstats")
      .findOne({ userId: new ObjectId(token.id as string) });

    if (!userStats) {
      throw new Error("Unable to locate user stats.");
    }

    const monthlyEmailData: IMonthlyEmailData[] = userStats.monthlyEmailData;

    res.status(200).json({ MonthlyStats: monthlyEmailData });
  } catch (err) {
    res.status(500).json({ Error: err });
  }
}
