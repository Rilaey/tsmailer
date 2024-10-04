import { getToken } from "next-auth/jwt";
import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "lib/db";
import { UserStat } from "@repo/models";
import cors from "../middleware/corsMiddleware";

export default async function getEmailDeliveryData(
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
      const userStats = await UserStat.findOne({
        userId: new ObjectId(token.id as string)
      });

      if (!userStats) {
        throw new Error("Unable to locate user stats.");
      }

      const monthlyEmailData = userStats.monthlyEmailData;
      const weeklyEmailData = userStats.weeklyEmailData;

      return res
        .status(200)
        .json({
          success: true,
          monthlyStats: monthlyEmailData,
          weeklyStats: weeklyEmailData
        });
    } catch (err) {
      return res.status(500).json({ error: err });
    }
  });
}
