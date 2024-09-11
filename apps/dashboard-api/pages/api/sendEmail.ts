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
  const { apiKey, emailAccountId, to, message, subject, emailProviderId } =
    req.body;

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

    // Check if user is at their max emails
    if (user.tier == "Free" && user.monthlySentMail >= 200) {
      await pushLogs(
        user._id,
        "Maximum monthly email cap hit.",
        "Warning",
        "Account",
        db
      );

      return res
        .status(403)
        .json({ Error: "Maximum sent emails reached based on tier." });
    }

    // assign clientId and clientSecret
    let assignedClientId;
    let assignedClientSecret;
    let transporter;

    // hoist zoho response
    let sendingEmail;

    // hoist universal status variable
    let isEmailResponseOk;

    switch (sendingEmailAccount.provider) {
      case "gmail":
        assignedClientId = process.env.GOOGLE_CLIENT_ID;
        assignedClientSecret = process.env.GOOGLE_CLIENT_SECRET;

        transporter = nodemailer.createTransport({
          service: sendingEmailAccount.provider,
          auth: {
            type: "OAuth2",
            user: sendingEmailAccount.email,
            clientId: assignedClientId,
            clientSecret: assignedClientSecret,
            refreshToken: sendingEmailAccount.refreshToken,
            accessToken: sendingEmailAccount.accessToken
          }
        });

        break;
      case "Zoho":
        const zohoEmail = await fetch(
          `https://mail.zoho.com/api/accounts/${emailProviderId}/messages`,
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Zoho-oauthtoken ${sendingEmailAccount.accessToken}`
            },
            body: JSON.stringify({
              fromAddress: sendingEmailAccount.email,
              toAddress: to,
              subject: subject,
              content: message,
              askReceipt: "yes"
            })
          }
        );

        sendingEmail = await zohoEmail.json();

        isEmailResponseOk = sendingEmail.status.code == 200;
      case "yahoo":
      case "aol":
        assignedClientId = process.env.YAHOO_CLIENT_ID;
        assignedClientSecret = process.env.YAHOO_CLIENT_SECRET;

        transporter = nodemailer.createTransport({
          service: sendingEmailAccount.provider,
          auth: {
            type: "OAuth2",
            user: sendingEmailAccount.email,
            clientId: assignedClientId,
            clientSecret: assignedClientSecret,
            refreshToken: sendingEmailAccount.refreshToken,
            accessToken: sendingEmailAccount.accessToken
          }
        });
        break;
      case "outlook":
      case "hotmail":
        assignedClientId = process.env.OUTLOOK_CLIENT_ID;
        assignedClientSecret = process.env.OUTLOOK_CLIENT_SECRET;

        transporter = nodemailer.createTransport({
          service: "outlook",
          auth: {
            type: "OAuth2",
            user: sendingEmailAccount.email,
            clientId: assignedClientId,
            clientSecret: assignedClientSecret,
            refreshToken: sendingEmailAccount.refreshToken,
            accessToken: sendingEmailAccount.accessToken
          }
        });
        break;
      default:
        break;
    }

    // don't overwrite sendingEmail variable if created in the switch case
    // want to keep the same variable name to keep logic below simple
    if (sendingEmailAccount.provider != "Zoho") {
      sendingEmail = await transporter?.sendMail({
        from: sendingEmailAccount.email,
        to: to,
        subject: subject,
        text: message,
        html: `<p>${message}</p>`
      });

      isEmailResponseOk = sendingEmail?.response.includes("250");
    }

    // Insert email document
    const newEmailDocument = {
      userId: user._id,
      to: Array.isArray(to) ? to : [to],
      from: sendingEmailAccount.email,
      message,
      subject,
      status: isEmailResponseOk ? "Sent" : "Failed",
      sentDate: new Date().toISOString()
    };

    // insert new email document
    await db.collection("emails").insertOne(newEmailDocument);

    // update user
    await db
      .collection("users")
      .updateOne(
        { apiKey },
        newEmailDocument.status == "Sent"
          ? { $inc: { totalSentMail: 1, monthlySentMail: 1 } }
          : { $inc: { totalSentMail: 0, monthlySentMail: 0 } }
      );

    // update email account
    await db
      .collection("emailaccounts")
      .updateOne(
        { _id: new ObjectId(String(emailAccountId as string)) },
        newEmailDocument.status == "Sent"
          ? { $inc: { sentMail: 1 } }
          : { $inc: { sentMail: 0 } }
      );

    // success
    if (newEmailDocument.status == "Sent") {
      await pushLogs(user._id, "Email sent.", "Success", "Email", db);

      return res.status(200).json({ "Email sent!": sendingEmail });
    }

    // Failure
    if (newEmailDocument.status == "Failed") {
      await pushLogs(user._id, "Email not sent.", "Error", "Email", db);

      return res.status(500).json({ Error: "Error sending email." });
    }
  } catch (err) {
    return res.status(500).json({ Error: err });
  }
}
