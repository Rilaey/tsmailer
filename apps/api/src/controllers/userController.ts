import { EmailAccounts, User, Logs } from "@repo/models";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import moment from "moment";
import { emailValidation } from "../utility/emailValidation";

const saltRounds = 10;

export const createUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  try {
    if (!name) {
      throw new Error("Name field is required.");
    }

    if (!email) {
      throw new Error("Email field is required.");
    }

    if (!email.match(emailValidation)) {
      throw new Error("Invalid email address format.");
    }

    if (!password) {
      throw new Error("Password field is required");
    }

    const hashedPassword = bcrypt.hashSync(password, saltRounds);

    const user = await User.create({
      name: name,
      email: email,
      password: hashedPassword
    });

    await Logs.create({
      userId: user._id,
      entries: [
        {
          message: "Account created.",
          state: "Success",
          variation: "Account",
          date: moment().format("dddd, MMMM Do YYYY, h:mm:ss a")
        }
      ]
    });

    await EmailAccounts.create({
      userId: user._id
    });

    res.status(200).json(user);
  } catch (err: any) {
    res.status(500).json(err.message);
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    if (!email) {
      throw new Error("Email field is required.");
    }

    if (!email.match(emailValidation)) {
      throw new Error("Invalid email address format.");
    }

    if (!password) {
      throw new Error("Password field is required");
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      throw new Error("Unable to locate user with provided email or password.");
    }

    const comparedPassword = bcrypt.compareSync(password, user.password ?? "");

    if (!comparedPassword) {
      throw new Error("Unable to locate user with provided email or password.");
    }

    await Logs.findOneAndUpdate(
      { userId: user._id },
      {
        $push: {
          entries: {
            message: "User login.",
            state: "Success",
            variation: "Account",
            date: moment().format("dddd, MMMM Do YYYY, h:mm:ss a")
          }
        }
      },
      {
        new: true
      }
    );

    res.status(200).json(user);
  } catch (err: any) {
    res.status(500).json(err.message);
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const { _id } = req.body;

  try {
    const user = await User.findById(_id);

    if (!user) {
      throw new Error("Unable to find user with the provided.");
    }

    res.status(200).json(user);
  } catch (err: any) {
    res.status(500).json(err.message);
  }
};
