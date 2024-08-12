import express from "express";
import { userController } from "../controllers";

const userRouter = express.Router();

userRouter.post("/createUser", userController.createUser);

userRouter.post("/loginUser", userController.loginUser);

userRouter.post("/getUserById", userController.getUserById);

export default userRouter;
