import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "lib/db";

/**
 * Validates and updates the user's monthly reset date for email limits.
 *
 * This function checks the current date against the user's `resetMonthlyEmailDate`.
 * If the current date exceeds the `resetMonthlyEmailDate`, it updates the reset date
 * by adding one month and persists the change in the database.
 *
 * @param {NextApiRequest} req - The API request object, containing the user's API key in the body.
 * @param {NextApiResponse} res - The API response object.
 *
 * @returns {Promise<void>} - Returns a JSON response with either the updated reset date or an error message.
 */
export default async function validateMonthlyResetDate(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const { apiKey } = req.body; // Extracts the user's API key from the request body

  try {
    const db = await dbConnect(); // Establishes a connection to the database

    // Finds the user in the database based on the provided API key
    const user = await db.collection("users").findOne({ apiKey });

    if (!user) {
      // If no user is found, throws an error
      throw new Error("Unable to locate user.");
    }

    const userStats = await db
      .collection("userstats")
      .findOne({ userId: user._id });

    if (!userStats) {
      // If no user is found, throws an error
      throw new Error("Unable to locate user stats.");
    }

    const currentDate = new Date(); // Gets the current date
    const resetDate = new Date(user.resetMonthlyEmailDate); // Convert reset date to a Date object

    // Checks if the current date is past the user's monthly reset date
    if (currentDate > resetDate) {
      // If so, adds one month to the current date
      const nextMonthDate = new Date(currentDate);
      nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);

      const addMonthDate = nextMonthDate.toISOString();

      const currentMonth = nextMonthDate.toLocaleString("default", {
        month: "long"
      });

      const currentYear = nextMonthDate.toLocaleString("default", {
        year: "numeric"
      });

      // Updates the user stats resetMonthlyEmailDate in the database
      await db.collection("userstats").updateOne({ userId: user._id }, {
        $set: { resetMonthlyEmailDate: addMonthDate },
        $push: {
          monthlyEmailData: {
            month: currentMonth,
            year: currentYear,
            sent: 0,
            failed: 0,
            apiCalls: 0
          }
        }
      } as Partial<Document>);

      // Sends a success response with the updated reset date
      res
        .status(200)
        .json({ Success: `Updated monthly reset date to ${addMonthDate}.` });
    }

    // Sends a success response with the current reset date if no update is needed
    res.status(200).json({
      Success: `Monthly email limit will reset on ${user.resetMonthlyEmailDate}.`
    });
  } catch (err) {
    // Catches any errors and sends a 500 response with the error message
    res.status(500).json({ Error: err });
  }
}
