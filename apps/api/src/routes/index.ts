import express from "express";
import userRouter from "./userRoutes";
import emailAccountsRouter from "./emailAccountsRoutes";

const router = express.Router();

router.use("/api/user", userRouter);
router.use("/api/emailAccounts", emailAccountsRouter);

export default router;
