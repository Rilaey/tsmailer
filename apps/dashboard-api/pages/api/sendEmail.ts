import "dotenv/config";
import dbConnect from "lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";
import { pushLogs } from "@repo/utility";
import { ObjectId } from "mongodb";

// Send email endpoint
export default async function sendEmail(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    apiKey,
    emailAccountId,
    from,
    accessToken,
    refreshToken,
    to,
    message,
    subject
  } = req.body;

  try {
    const db = await dbConnect();

    const user = await db.collection("users").findOne({ apiKey });

    if (!user) {
      throw new Error("Unable to locate user.");
    }

    const sendingEmailAccount = await db
      .collection("emailaccounts")
      .findOne({ _id: new ObjectId(String(emailAccountId as string)) });

    if (!sendingEmailAccount) {
      throw new Error("Unable to locate email account.");
    }

    const currentDate = new Date().toISOString();

    // Check if user is at their max emails
    if (
      user.tier == "Free" &&
      user.monthlySentMail >= 200 &&
      currentDate > user.resetMonthlyEmailDate
    ) {
      return res
        .status(403)
        .json({ Error: "Maximum sent emails reached based on tier." });
    }

    // assign clientId and clientSecret
    let assignedClientId;
    let assignedClientSecret;

    // more to come in the future
    if (sendingEmailAccount.provider == "gmail") {
      assignedClientId = process.env.GOOGLE_CLIENT_ID;
      assignedClientSecret = process.env.GOOGLE_CLIENT_SECRET;
    }

    // Create Transporter
    const transporter = nodemailer.createTransport({
      service: sendingEmailAccount.provider,
      auth: {
        type: "OAuth2",
        user: from,
        clientId: assignedClientId,
        clientSecret: assignedClientSecret,
        refreshToken: refreshToken,
        accessToken: accessToken
      }
    });

    // Send email
    const sendingEmail = await transporter.sendMail({
      from: from,
      to: to,
      subject: subject,
      text: message,
      html: `<p>${message}</p>`
    });

    // Insert email document
    const newEmailDocument = {
      userId: user._id,
      to: Array.isArray(to) ? to : [to],
      from,
      message,
      subject,
      status: sendingEmail.response,
      sentDate: new Date().toISOString()
    };

    await db.collection("emails").insertOne(newEmailDocument);

    // Check status of send mail transporter
    if (sendingEmail.accepted) {
      await pushLogs(user._id, "Email sent.", "Success", "Email", db);

      await db
        .collection("users")
        .updateOne(
          { apiKey },
          { $inc: { totalSentMail: 1, monthlySentMail: 1 } }
        );

      await db
        .collection("emailaccounts")
        .updateOne(
          { _id: new ObjectId(String(emailAccountId as string)) },
          { $inc: { sentMail: 1 } }
        );

      return res.status(200).json({ "Email sent!": sendingEmail });
    }

    // Failure
    await pushLogs(user._id, "Email not sent.", "Error", "Email", db);

    return res.status(500).json({ Error: "Error sending email." });
  } catch (err) {
    return res.status(500).json({ Error: err });
  }
}
