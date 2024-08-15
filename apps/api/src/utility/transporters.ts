import "dotenv/config";
import nodemailer from "nodemailer";

// 1) Using tsmailer support email. want to change it to a "noreply" email.
export const userVerificationTransporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.CREATE_ACCOUNT_AUTH_TSMAILER_EMAIL,
    pass: process.env.CREATE_ACCOUNT_AUTH_TSMAILER_PASSWORD
  }
});
