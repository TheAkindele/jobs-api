import {Response, Request, NextFunction} from "express"
import {UserModel, IUser} from "../models"
import { BadRequestError, UnAuthorizedError } from "../middlewears/errors"
import { StatusCodes } from "http-status-codes"
import {omit} from "lodash"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { createUserInput } from "types/user.types"

//createUser, login, verify email

export const createUser = async (req: Request<{}, {}, createUserInput["body"]>, res: Response) => {
    const {name, email, role, password, confirmPassword} = req.body

    //job recruiter role = recruiter
    //job seeker role = candidate

    // check if user already exist
    const checkEmail = await UserModel.findOne({email})
    if (checkEmail) {
        throw new BadRequestError("Email already exist")
    }

    //check if password and confirm password match
    if (password !== confirmPassword) {
        throw new BadRequestError("Password must match")
    }

    //else create the user
    // const newUser: IUser = await UserModel.create({...req.body})
    const user = await UserModel.create({...req.body})

    // const user = omit(newUser.toJSON(), "password")

    // // now we call the createJWT mongoose instance method  
    // const token = user.createJWT()
    // const token = jwt.sign(
    //     {userId: user._id, email: user.email, role: user.role}, 
    //     `${process.env.JOBS_API_JWT_SECRET}`, 
    //     {expiresIn: "10d"}
    // )
    const token = await user.createJWT()

    res.status(StatusCodes.CREATED).json({user, token})
}


export const login = async (req: Request, res: Response) => {
    const {email, password} = req.body

    if (!email || !password) {
        throw new BadRequestError("email and password required")
    }

    const findUser = await UserModel.findOne({email})
    
    if (!findUser) {
        throw new UnAuthorizedError("Invalid credentials")
    }

    // we call then compare password using comparePassword method from our model
    const isPasswordCorrect = await findUser?.comparePassword(password)

    if (!isPasswordCorrect) {
        throw new BadRequestError("Invalid credentials")
    }

    // to return user obj without the password we can use the mongoose select method
    // const userId = user._id
    // const userObj = UserModel.findById(userId).select("-password")

    //or we use the lodash omit fxn to remove an obj property
    const user = omit(findUser.toJSON(), "password")

    const token = await findUser.createJWT()
    // const token = jwt.sign(
    //     {userId: user._id, email: user.email, role: user.role}, 
    //     `${process.env.JOBS_API_JWT_SECRET}`, 
    //     {expiresIn: "10d"}
    // )
    
    res.status(StatusCodes.OK).json({user, token})
}

