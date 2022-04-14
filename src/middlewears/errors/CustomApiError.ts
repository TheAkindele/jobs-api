
export class CustomApiError extends Error {
    statusCode!: number;
    // statusCode: number
    
    constructor(message: any) {
        super(message)
        // this.statusCode = statusCode
    }
}

// export default CustomApiError
