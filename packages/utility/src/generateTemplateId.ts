import { Connection } from "mongoose";
import { randomBytes } from "crypto";

const generateTemplateId = async (db: Connection, length: number = 24) => {
  return new Promise((resolve, reject) => {
    const tryGenerate = async () => {
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
    };

    tryGenerate();
  });
};

export { generateTemplateId };
