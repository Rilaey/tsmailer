import { getToken } from "next-auth/jwt";
import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "lib/db";

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
  const token = await getToken({ req });

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const db = await dbConnect();

  try {
    const userStats = await db
      .collection("userstats")
      .findOne({ userId: new ObjectId(token.id as string) });

    // If no user found, throw an error
    if (!userStats) {
      throw new Error("Unable to locate user stats.");
    }

    // Count the number of successful emails sent by the user
    const successfulEmails = await db.collection("emails").countDocuments({
      userId: new ObjectId(token.id as string),
      status: "Sent"
    });

    // Calculate the email delivery rate
    const emailDeliveryRate =
      (successfulEmails / userStats.totalSentMail) * 100;

    // Send a successful response with the user's stats
    res.status(200).json({
      totalApiCalls: userStats.totalApiCalls,
      totalEmailSent: userStats.totalSentMail,
      deliveryRate: emailDeliveryRate
    });
  } catch (err) {
    res.status(500).json({ Error: err });
  }
}
