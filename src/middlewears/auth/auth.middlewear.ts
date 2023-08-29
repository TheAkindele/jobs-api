import {Request, Response, NextFunction} from "express"
import jwt from "jsonwebtoken"
import { UserModel, IUser, UserDocument } from "../../models"
import { BadRequestError, UnAuthorizedError } from "../errors"
import {omit} from "lodash" 

export interface reqType extends Request {
  user?: UserDocument;
  token?: string
}

export const authorizationMiddlewear = async (req: Request, res: Response, next: NextFunction) => {
    const requestHeader = req.headers.authorization

    const request = req as reqType

    if (!requestHeader || !requestHeader.startsWith("Bearer ")) {
        throw new UnAuthorizedError("No token provided")
    }

    const token = requestHeader.split(" ")[1]
    try {
      // here we verify the token in the client headers
      const decodedToken = jwt.verify(token, `${process.env.JOBS_API_JWT_SECRET}`,
        /// we can as well check to confirm token has nit expired 
        // (err: any) => {
        //   if (err) "token expired"
        // }
      )

      const {userId}: any = decodedToken

      //To get the user obj from the database without returning the password prop,
      //we can use either of the 2 ways below;

      // 1. we use the mongoose select method with - to unselect te p/word
      // const user = await UserModel.findById(userId).select("-password")
      // const {name, email, _id} = user
      // //@ts-ignore
      // req.user = {name, email, userId: _id}

      //2. we use the lodash omit fxn to remove an obj prop
      const user = await UserModel.findOne({_id: userId}).select("-password")

      if (!user) throw new BadRequestError("No user found")

      request.user = user
      // omit(user?.toJSON(), "password")

      
      request.token = token

      next()

    } catch (error) {
      throw new UnAuthorizedError("You are not authorized here")
    }
}


