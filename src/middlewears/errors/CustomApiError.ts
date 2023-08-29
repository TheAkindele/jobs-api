export class CustomApiError extends Error {
    statusCode!: number;
    
    constructor(message: any) {
        super(message)
    }
}

