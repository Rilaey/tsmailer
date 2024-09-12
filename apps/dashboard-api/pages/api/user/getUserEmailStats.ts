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
  const { apiKey } = req.body;

  try {
    // Connect to the database
    const db = await dbConnect();

    // Find the user by apiKey
    const user = await db.collection("users").findOne({ apiKey });

    // If no user found, throw an error
    if (!user) {
      throw new Error("Unable to locate user.");
    }

    // Count the number of successful emails sent by the user
    const successfulEmails = await db
      .collection("emails")
      .countDocuments({ userId: user._id, status: "Sent" });

    // Calculate the email delivery rate
    const emailDeliveryRate = (successfulEmails / user.totalSentMail) * 100;

    // Send a successful response with the user's stats
    res.status(200).json({
      totalApiCalls: user.totalApiCalls,
      totalEmailSent: user.totalSentMail,
      deliveryRate: emailDeliveryRate
    });
  } catch (err) {
    res.status(500).json({ Error: err });
  }
}
