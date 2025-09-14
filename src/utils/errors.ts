/**
 * Custom application error for standardized error handling
 * Extends the built-in Error class
 */
export class AppError extends Error {
    public readonly statusCode: number // HTTP status code for the error
    public readonly errorCode: string  // Custom error code for identifying error type

    /**
     * Constructs a new AppError
     * @param message Error message
     * @param statusCode HTTP status code
     * @param errorCode Custom error code
     */
    constructor(message: string, statusCode: number, errorCode: string) {
        super(message)
        this.errorCode = errorCode
        this.statusCode = statusCode

        this.name = this.constructor.name

        // Capture stack trace for debugging
        Error.captureStackTrace(this, this.constructor)
    }
}

export class NotFoundError extends AppError{
    constructor(message: string) {
        super(message, 404, 'NOT_FOUND')
    }
}