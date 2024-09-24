import { Connection } from "mongoose";
import { randomBytes } from "crypto";

const generateUniqueId = async (
  db: Connection,
  type: string,
  length: number = 24
) => {
  return new Promise((resolve, reject) => {
    const tryGenerate = async () => {
      switch (type) {
        case "template":
          try {
            const templateId = randomBytes(length).toString("hex"); // Generate random string

            const existingTemplateId = await db
              .collection("templates")
              .findOne({ templateId: `template_${templateId}` });

            if (!existingTemplateId) {
              resolve(templateId);
            } else {
              tryGenerate(); // Retry if duplicate
            }
          } catch (error) {
            reject(error);
          }
          break;
        case "apiKey":
          try {
            const apiKey = randomBytes(length).toString("hex"); // Generate random string

            const existingUser = await db
              .collection("users")
              .findOne({ apiKey });

            if (!existingUser) {
              resolve(apiKey); // Unique API key, resolve the promise
            } else {
              tryGenerate(); // Retry if duplicate
            }
          } catch (error) {
            reject(error); // Reject if any error occurs
          }
          break;
        case "provider":
          try {
            const providerId = randomBytes(length).toString("hex"); // Generate random string

            const existingEmailProvider = await db
              .collection("emailaccounts")
              .findOne({ providerId });

            if (!existingEmailProvider) {
              resolve(providerId); // Unique API key, resolve the promise
            } else {
              tryGenerate(); // Retry if duplicate
            }
          } catch (error) {
            reject(error); // Reject if any error occurs
          }
          break;
        default:
          break;
      }
    };

    tryGenerate();
  });
};

export { generateUniqueId };
