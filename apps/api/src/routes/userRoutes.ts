import express from "express";
import { userController } from "../controllers";

const userRouter = express.Router();

userRouter.post("/createUser", userController.createUser);

export default userRouter;
