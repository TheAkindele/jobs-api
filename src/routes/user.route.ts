import { Router } from "express";
import { validateResource } from "../middlewears/validateResource";
import { createUserSchema } from "../types/user.types";
import {createUser, login} from "../controllers"
export const authRouter = Router()

// for user signup route, we added a middlewear that helps validate user data received to make sure its the right data type that is sent by client
authRouter.route("/signup").post(validateResource(createUserSchema), createUser)
authRouter.route("/login").post(login)
