import { Request, Response, NextFunction } from "express";
import {CustomApiError} from "./CustomApiError"
import {StatusCodes} from "http-status-codes"


export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    let customErrObj = {
        errStatusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        errMssg: err.message || "Something went wrong, try again"
    }

    //we check if its an instandce of the CustomApiError
    // if (err instanceof CustomApiError) {
    //     return res.status(err?.statusCode).json({errMssg: err?.message})
    // }

    //now using the customErr object, we categorize our mongoose errors into 3 instances

    // 1. duplicate unique value error instance i.e when there's a duplicate of a unique value like email
    if (err?.code === 11000) {
        customErrObj.errStatusCode = 400
        customErrObj.errMssg = `Duplicate ${Object.keys(err.keyValue)} value, please choose another value `
    }

    //2. validation error instance i.e if user does not provide one of the required values
    if (err?.name === "ValidationError") {
        customErrObj.errMssg = Object.values(err?.errors)?.map((item: any) => item.message).join(", ")
        customErrObj.errStatusCode = 400
    }

    //3. cast error i.e when an invalid ID is passed/queried to mongoose, hence it will not match any of the IDs in the database
    if (err?.name === "CastError") {
        customErrObj.errMssg = `No item with ID ${err.value} found`
        customErrObj.errStatusCode = 404
    }

    // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({err})
    return res.status(customErrObj.errStatusCode).json({mssg: customErrObj.errMssg})
}

