import { User, EmailAccounts } from "../models";
import { Request, Response } from "express";
import bcrypt from "bcrypt";

const saltRounds = 10;

export const createUser = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    const hashedPassword = bcrypt.hashSync(password, saltRounds);

    const user = await User.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashedPassword
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
    const user = await User.findOne({ email: email });

    if (!user) {
      throw new Error("Unable to locate user with provided email or password.");
    }

    const comparedPassword = bcrypt.compareSync(password, user.password ?? "");

    if (!comparedPassword) {
      throw new Error("Unable to locate user with provided email or password.");
    }

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
