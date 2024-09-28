import { getToken } from "next-auth/jwt";
import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "lib/db";
import cors from "../middleware/corsMiddleware";
import { Email, UserStat } from "@repo/models";

/**
 * API endpoint to retrieve a user's email statistics.
 *
 * This function calculates the total API calls, total emails sent,
 * and the email delivery rate based on the user's `apiKey`.
 *
 * @param {NextApiRequest} req - The API request object.
 * @param {NextApiResponse} res - The API response object.
 * @returns {Promise<void>} - Returns the user's email statistics or an error response.
 */
export default async function getUserEmailStats(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  cors(req, res, async () => {
    const token = await getToken({ req });

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    await dbConnect();

    try {
      const userStats = await UserStat.findOne({
        userId: new ObjectId(token.id as ObjectId)
      });

      // If no user found, throw an error
      if (!userStats) {
        throw new Error("Unable to locate user stats.");
      }

      // Count the number of successful emails sent by the user
      const successfulEmails = await Email.countDocuments({
        userId: new ObjectId(token.id as ObjectId),
        status: "Sent"
      });

      // Calculate the email delivery rate
      const emailDeliveryRate =
        (successfulEmails / userStats.totalSentMail) * 100;

      // Send a successful response with the user's stats
      return res.status(200).json({
        totalApiCalls: userStats.totalApiCalls,
        totalEmailSent: userStats.totalSentMail,
        deliveryRate: emailDeliveryRate
      });
    } catch (err) {
      return res.status(500).json({ error: err });
    }
  });
}
