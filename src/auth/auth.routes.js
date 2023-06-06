import { Router } from "express";
import * as authController from "./auth.controller.js";

const authRouter = Router();

authRouter.route("/signup").post(authController.signup);
authRouter.route("/token").post(authController.token);
authRouter.route("/login").post(authController.login);


export default authRouter
