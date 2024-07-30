import { User } from "../models";
import { Request, Response } from "express";

export const createUser = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    const user = await User.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password
    });

    res.status(200).send(user);
  } catch (err) {
    res.status(500).send(err);
  }
};
