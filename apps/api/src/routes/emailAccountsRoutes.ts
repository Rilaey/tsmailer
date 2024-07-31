import express from "express";
import { emailAccountsController } from "../controllers";

const emailAccountsRouter = express.Router();

emailAccountsRouter.post(
  "/yahoo/create",
  emailAccountsController.addYahooEmail
);

export default emailAccountsRouter;
