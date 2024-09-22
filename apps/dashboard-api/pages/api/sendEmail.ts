import "dotenv/config";
import dbConnect from "lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";
import { pushLogs } from "@repo/utility";
import { ObjectId } from "mongodb";
import { ITemplate } from "@repo/types";

interface IDynamicEmailVariables {
  toName: string;
  fromName: string;
  yourMessage: string;
}

// Send email endpoint
export default async function sendEmail(
  req: NextApiRequest,
  res: NextApiResponse,
  to: string[],
  templateId: ITemplate,
  apiKey: string,
  emailAccountId: string,
  options: IDynamicEmailVariables
) {
  // only here for testing in postman
  // will be removed once testing is no longer needed.
  // const { apiKey, emailAccountId, to, emailProviderId, options, templateId } =
  //   req.body;

  // if (!apiKey || !emailAccountId) {
  //   return res
  //     .status(400)
  //     .json({ Error: "API key and email provider are required." });
  // }

  const db = await dbConnect();

  try {
    const user = await db.collection("users").findOne({ apiKey });

    if (!user) {
      return res.status(400).json({ Error: "Invalid API key." });
    }

    const template = await db.collection("templates").findOne({ templateId });

    if (!template) {
      return res.status(400).json({ Error: "Invalid template ID." });
    }

    const { content, subject } = template;

    // Replace dynamic values in content string
    const replacements: { [key: string]: string } = {
      to_name: options.toName,
      from_name: options.fromName,
      message: options.yourMessage
    };

    const updatedContentString = content.replace(
      /{{(.*?)}}/g,
      (match: string, p1: string) => replacements[p1.trim()] || match // Fallback to the original match if no replacement is found
    );

    const updatedSubjectString = subject.replace(
      /{{(.*?)}}/g,
      (match: string, p1: string) => replacements[p1.trim()] || match // Fallback to the original match if no replacement is found
    );

    const userStats = await db
      .collection("userstats")
      .findOne({ userId: user._id });

    if (!userStats) {
      return res.status(400).json({ Error: "Unable to update user stats." });
    }

    const sendingEmailAccount = await db
      .collection("emailaccounts")
      .findOne({ _id: new ObjectId(String(emailAccountId as string)) });

    if (!sendingEmailAccount) {
      return res.status(400).json({ Error: "Unable to locate email account" });
    }

    // get most recent entry in monthly email data
    const { apiCalls } =
      userStats.monthlyEmailData[userStats.monthlyEmailData.length - 1];

    // Check if user is at their max emails
    if (user.tier == "Free" && apiCalls >= 200) {
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
          `https://mail.zoho.com/api/accounts/${sendingEmailAccount.emailProviderId}/messages`,
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
              subject: updatedSubjectString,
              content: updatedContentString,
              askReceipt: "yes"
            })
          }
        );

        sendingEmail = await zohoEmail.json();

        isEmailResponseOk = sendingEmail.status.code == 200;
        break;
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
        subject: updatedSubjectString,
        text: updatedContentString
      });

      isEmailResponseOk = sendingEmail?.response.includes("250");
    }

    // Insert email document
    const newEmailDocument = {
      userId: user._id,
      templateId: template._id,
      to: Array.isArray(to) ? to : [to],
      from: sendingEmailAccount.email,
      message: updatedContentString,
      subject: updatedSubjectString,
      status: isEmailResponseOk ? "Sent" : "Failed",
      responseTime: sendingEmail.messageTime,
      size: sendingEmail.messageSize,
      sentDate: new Date().toISOString()
    };

    // insert new email document
    const newEmailDocumentMongoMeta = await db
      .collection("emails")
      .insertOne(newEmailDocument);

    const lastIndexOfMonthlyEmailData = userStats.monthlyEmailData.length - 1;

    // update user stats
    await db.collection("userstats").updateOne(
      { userId: user._id },
      newEmailDocument.status == "Sent"
        ? {
            $inc: {
              totalApiCalls: 1,
              totalSentMail: to.length,
              [`monthlyEmailData.${lastIndexOfMonthlyEmailData}.sent`]:
                to.length,
              [`monthlyEmailData.${lastIndexOfMonthlyEmailData}.apiCalls`]: 1
            }
          }
        : {
            $inc: {
              totalApiCalls: 1,
              [`monthlyEmailData.${lastIndexOfMonthlyEmailData}.apiCalls`]: 1
            }
          }
    );

    // success
    if (newEmailDocument.status == "Sent") {
      // update email account
      await db
        .collection("emailaccounts")
        .updateOne(
          { _id: new ObjectId(String(emailAccountId as string)) },
          { $inc: { sentMail: to.length } }
        );

      // create success logs
      for (let i = 0; i < to.length; i++) {
        await pushLogs(
          user._id,
          "Email sent.",
          "Success",
          "Email",
          db,
          newEmailDocumentMongoMeta.insertedId
        );
      }

      // update template
      await db.collection("templates").updateOne(
        { _id: new ObjectId(template._id) },
        {
          $inc: {
            totalEmailUsage: to.length
          }
        }
      );

      return res.status(200).json({ "Email sent!": sendingEmail });
    }

    // Failure
    if (newEmailDocument.status == "Failed") {
      for (let i = 0; i < to.length; i++) {
        await pushLogs(
          user._id,
          "Email not sent.",
          "Error",
          "Email",
          db,
          newEmailDocumentMongoMeta.insertedId
        );
      }

      return res.status(500).json({ Error: "Error sending email." });
    }
  } catch (err) {
    return res.status(500).json({ Error: err });
  }
}
