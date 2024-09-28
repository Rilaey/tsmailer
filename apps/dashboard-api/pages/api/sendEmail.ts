import "dotenv/config";
import dbConnect from "lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";
import { pushLogs } from "@repo/utility";
import { User, Template, UserStat, Email, EmailAccount } from "@repo/models";
import { ITemplate } from "@repo/types";
import { ObjectId } from "mongodb";

interface IDynamicEmailVariables {
  toName: string;
  fromName: string;
  yourMessage: string;
}

// Send email endpoint
export default async function sendEmail(
  req: NextApiRequest,
  res: NextApiResponse
  // to: string[],
  // templateId: ITemplate,
  // apiKey: string,
  // providerId: string,
  // options: IDynamicEmailVariables
) {
  // only here for testing in postman
  //will be removed once testing is no longer needed.
  const { apiKey, to, providerId, options, templateId } = req.body;

  // if (!apiKey || !emailAccountId) {
  //   return res
  //     .status(400)
  //     .json({ Error: "API key and email provider are required." });
  // }

  const db = await dbConnect();

  try {
    const user = await User.findOne({ apiKey });

    if (!user) {
      return res.status(400).json({ error: "Invalid API key." });
    }

    const template = await Template.findOne({ templateId });

    if (!template) {
      return res.status(400).json({ error: "Invalid template ID." });
    }

    const userStats = await UserStat.findOne({ userId: user._id });

    if (!userStats) {
      return res.status(400).json({ error: "Unable to update user stats." });
    }

    const sendingEmailAccount = await EmailAccount.findOne({ providerId });

    if (!sendingEmailAccount) {
      return res.status(400).json({ error: "Unable to locate email account" });
    }

    const { content, subject } = template;

    // Replace dynamic values in content string
    const replacements: { [key: string]: string } = {
      to_name: options.toName ?? "",
      from_name: options.fromName ?? "",
      message: options.yourMessage ?? ""
    };

    const updatedContentString = content.replace(
      /{{(.*?)}}/g,
      (match: string, p1: string) => replacements[p1.trim()] || match // Fallback to the original match if no replacement is found
    );

    const updatedSubjectString = subject.replace(
      /{{(.*?)}}/g,
      (match: string, p1: string) => replacements[p1.trim()] || match // Fallback to the original match if no replacement is found
    );

    // get most recent entry in monthly email data
    const lastMonthData =
      userStats.monthlyEmailData[userStats.monthlyEmailData.length - 1];

    // make sure we have accurate monthly data
    if (lastMonthData) {
      // Check if user is at their max emails
      if (user.tier == "Free" && lastMonthData.apiCalls >= 200) {
        await pushLogs(
          user._id as any as ObjectId,
          "Maximum monthly email cap hit.",
          "Warning",
          "Account",
          db
        );

        return res
          .status(403)
          .json({ error: "Maximum sent emails reached based on tier" });
      }
    } else {
      return res.status(400).json({ error: "Unable to read user stats" });
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
    const newEmailDocument = await Email.create({
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
    });

    const lastIndexOfMonthlyEmailData = userStats.monthlyEmailData.length - 1;

    if (newEmailDocument.status == "Sent") {
      // update user stats
      userStats.totalApiCalls++;
      userStats.totalSentMail += to.length;
      userStats.monthlyEmailData[lastIndexOfMonthlyEmailData]!.sent +=
        to.length;
      userStats.monthlyEmailData[lastIndexOfMonthlyEmailData]!.apiCalls++;

      // update email document
      sendingEmailAccount.sentMail += to.length;

      // update template
      template.totalEmailUsage += to.length;

      // create success logs
      for (let i = 0; i < to.length; i++) {
        await pushLogs(
          user._id as any as ObjectId,
          `Email sent to ${to[i]}`,
          "Success",
          "Email",
          db,
          newEmailDocument._id as any as ObjectId
        );
      }

      await userStats.save();
      await sendingEmailAccount.save();
      await template.save();

      return res.status(200).json({ "Email sent!": sendingEmail });
    } else {
      // update user stats
      userStats.totalApiCalls++;
      userStats.monthlyEmailData[lastIndexOfMonthlyEmailData]!.apiCalls++;

      // create fail logs
      for (let i = 0; i < to.length; i++) {
        await pushLogs(
          user._id as any as ObjectId,
          "Email not sent.",
          "Error",
          "Email",
          db,
          newEmailDocument._id as any as ObjectId
        );
      }

      await userStats.save();
      await sendingEmailAccount.save();
      await template.save();

      return res.status(500).json({ error: "Error sending email." });
    }
  } catch (err) {
    return res.status(500).json({ error: err });
  }
}
