// const CustomApiError = require("./CustomApiError")
import {CustomApiError} from "./CustomApiError"
import {StatusCodes} from "http-status-codes"

export class UnAuthorizedError extends CustomApiError {
    statusCode: number

    constructor(message: string) {
        super(message)
        this.statusCode = StatusCodes.UNAUTHORIZED
    }
}

// module.exports = UnAuthorizedError
