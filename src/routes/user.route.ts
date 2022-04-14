import { Router } from "express";
import { validateResource } from "../middlewears/validateResource";
import { createUserSchema } from "../types/user.types";
import {createUser, login} from "../controllers"
export const authRouter = Router()

authRouter.route("/signup").post(validateResource(createUserSchema), createUser)
authRouter.route("/login").post(login)
