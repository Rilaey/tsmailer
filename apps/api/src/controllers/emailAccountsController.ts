import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { EmailAccounts, Logs } from "@repo/models";
import { emailValidation } from "../utility/emailValidation";
import moment from "moment";

const saltRounds = 10;

export const addYahooEmail = async (req: Request, res: Response) => {
  const { userId, email, password, nickName } = req.body;
  try {
    if (!nickName) {
      throw new Error("Nickname field is required.");
    }

    if (!password) {
      throw new Error("Password field is required.");
    }

    if (!email) {
      throw new Error("Email field is required.");
    }

    if (!email.match(emailValidation)) {
      throw new Error("Invalid email address format.");
    }

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

    await Logs.findOneAndUpdate(
      { userId: userId },
      {
        $push: {
          entries: [
            {
              message: "Yahoo email account added.",
              state: "Success",
              variation: "Email",
              date: moment().format("dddd, MMMM Do YYYY, h:mm:ss a")
            }
          ]
        }
      },
      {
        new: true
      }
    );

    res.status(200).json(emailAccounts);
  } catch (err: any) {
    res.status(500).json(err.message);
  }
};
