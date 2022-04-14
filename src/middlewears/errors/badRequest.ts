// const CustomApiError = require("./CustomApiError")
import {CustomApiError} from "./CustomApiError"
import {StatusCodes} from "http-status-codes"

export class BadRequestError extends CustomApiError {
    // statusCode: number
    
    constructor(message: string) {
        super(message)
        this.statusCode = StatusCodes.BAD_REQUEST
    }
}

// module.exports = BadRequestError