import {CustomApiError} from "./CustomApiError"
import {StatusCodes} from "http-status-codes"

export class BadRequestError extends CustomApiError {
    constructor(message: string) {
        super(message)
        this.statusCode = StatusCodes.BAD_REQUEST
    }
}
