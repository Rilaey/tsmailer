import express from "express";
import userRouter from "./userRoutes";

const router = express.Router();

router.use("/api/user", userRouter);

export default router;
