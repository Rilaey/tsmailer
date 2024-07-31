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

    await user.save();

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};
