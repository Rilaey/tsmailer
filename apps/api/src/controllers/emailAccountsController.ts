import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { EmailAccounts, User } from "@repo/models";

const saltRounds = 10;

export const addYahooEmail = async (req: Request, res: Response) => {
  const { userId, email, password, nickName } = req.body;
  try {
    const hashedPassword = bcrypt.hashSync(password, saltRounds);

    const emailAccounts = await EmailAccounts.findOneAndUpdate(
      { userId: userId },
      {
        $push: {
          yahoo: { email: email, password: hashedPassword, nickName: nickName }
        }
      },
      { new: true }
    );

    if (!emailAccounts) {
      throw new Error("Unable to locate email address document.");
    }

    res.status(200).json(emailAccounts);
  } catch (err: any) {
    res.status(500).json(err.message);
  }
};
