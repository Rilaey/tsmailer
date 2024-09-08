import { randomBytes } from "crypto";
import { Connection } from "mongoose";

const generateUniqueApiKey = (
  length: number = 32,
  db: Connection
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const tryGenerate = async () => {
      try {
        const apiKey = randomBytes(length).toString("hex"); // Generate random string

        const existingUser = await db.collection("users").findOne({ apiKey });

        if (!existingUser) {
          resolve(apiKey); // Unique API key, resolve the promise
        } else {
          tryGenerate(); // Retry if duplicate
        }
      } catch (error) {
        reject(error); // Reject if any error occurs
      }
    };

    // Start generating the API key
    tryGenerate();
  });
};

export { generateUniqueApiKey };
