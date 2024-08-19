import "dotenv/config";
import { EmailAccounts, User, Logs } from "@repo/models";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import moment from "moment";
import { emailValidation } from "@repo/utility";
import { userVerificationTransporter } from "../utility/transporters";
import jwt from "jsonwebtoken";
import { pushLogs } from "../utility/logs/pushLogs";
import { v4 as uuidv4 } from "uuid";

const secret = process.env.AUTH_SECRET;

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

    const duplicateUser = await User.findOne({ email: email });

    if (duplicateUser) {
      throw new Error("User already exist with the provided email.");
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const user = await User.create({
      name: name,
      email: email,
      password: hashedPassword
    });

    const logs = await Logs.create({
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

    const emailAccounts = await EmailAccounts.create({
      userId: user._id
    });

    const jwtPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
      jwtid: uuidv4()
    };

    // Generate the JWT
    const token = jwt.sign(jwtPayload, secret as string, {
      expiresIn: process.env.jwtTokenExpiration
    });

    user.emailAccountsId = emailAccounts._id;
    user.logsId = logs._id;
    user.jti = jwtPayload.jwtid;

    await user.save();

    const verificationLink = `http://localhost:8082/login?token=${token}`;

    await userVerificationTransporter.sendMail({
      from: process.env.CREATE_ACCOUNT_AUTH_TSMAILER_EMAIL,
      to: user.email,
      subject: "Please authenticate your TSMailer account.",
      text: "Plaintext version of the message",
      html: `
      <div> 
        <p>Hello, ${user.name}! Please click <a href=${verificationLink}>here</a> to authenticate your new TSMailer account.</p>
      </div>
      `
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

    await pushLogs(user._id, "User login.", "Success", "Account");

    res.status(200).json(user);
  } catch (err: any) {
    res.status(500).json(err.message);
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const { _id } = req.body;

  try {
    const user = await User.findById(_id)
      .populate("emailAccountsId")
      .populate("logsId")
      .exec();

    if (!user) {
      throw new Error("Unable to find user with the provided id.");
    }

    res.status(200).json(user);
  } catch (err: any) {
    res.status(500).json(err.message);
  }
};

export const verifyUserEmail = async (req: Request, res: Response) => {
  const { email, jti } = req.body;
  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      throw new Error("Unable to locate user to verify email address.");
    }

    if (user.jti != jti) {
      await pushLogs(user._id, "Failed user verification", "Error", "Account");

      throw new Error("Unable to verify jti. Please try again.");
    }

    user.jti = null;
    user.isEmailVerified = true;

    await user.save();

    await pushLogs(user._id, "Account verified", "Success", "Account");

    res.status(200).json(user);
  } catch (err: any) {
    res.status(500).json(err.message);
  }
};

export const resendEmailVerification = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      throw new Error("Unable to locate user with the provided email.");
    }

    const jwtPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
      jwtid: uuidv4()
    };

    const token = jwt.sign(jwtPayload, secret as string, {
      expiresIn: process.env.jwtTokenExpiration
    });

    user.jti = jwtPayload.jwtid;

    await user.save();

    await pushLogs(user._id, "Resent email verification", "Success", "Account");

    const verificationLink = `http://localhost:8082/login?token=${token}`;

    await userVerificationTransporter.sendMail({
      from: process.env.CREATE_ACCOUNT_AUTH_TSMAILER_EMAIL,
      to: user.email,
      subject: "Please authenticate your TSMailer account.",
      text: "Plaintext version of the message",
      html: `
      <div> 
        <p>Hello, ${user.name}! Please click <a href=${verificationLink}>here</a> to authenticate your new TSMailer account.</p>
      </div>
      `
    });

    res.status(200).json(user);
  } catch (err: any) {
    res.status(500).json(err.message);
  }
};
