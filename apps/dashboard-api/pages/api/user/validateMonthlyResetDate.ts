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

    const currentDate = new Date(); // Gets the current date

    // Checks if the current date is past the user's monthly reset date
    if (currentDate > user.resetMonthlyEmailDate) {
      // If so, adds one month to the current date
      const addMonthDate = new Date(
        currentDate.setMonth(currentDate.getMonth() + 1)
      ).toISOString();

      // Updates the user's resetMonthlyEmailDate in the database
      await db
        .collection("users")
        .updateOne(
          { apiKey },
          { $set: { resetMonthlyEmailDate: addMonthDate } }
        );

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
