// Error handling middleware and async wrapper for Express
import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../types";
import { AppError } from "../utils/errors";

// Wraps async route handlers to catch errors and pass to next()
type ExpressHandler = (req: Request, res: Response, next: NextFunction) => Promise<any> | any
export const catchAsync = (fn: ExpressHandler) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next)
    }
}

// Main error handler middleware for Express
// Formats error responses using ApiResponse type
export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction): void => {
    let statusCode = 500
    let message = error.message || 'Internal Server Error'
    let errorCode = 'INTERNAL_SERVER_ERROR'

    // If error is an instance of AppError, extract status and code
    if (error instanceof AppError) {
        statusCode = error.statusCode
        errorCode = error.errorCode
    }

    // Build error response object
    const response: ApiResponse = {
        success: false,
        message,
        error: {
            code: errorCode,
            // Only include stack trace in development
            ...(process.env.NODE_ENV === 'development' && error.stack
                ? { stack: error.stack } :
                {}
            )
        }
    }    

    res.status(statusCode).json(response)
}

// 404 handler
export const notFoundHandler = (req: Request, res: Response): void => {
    const response: ApiResponse = {
        success: false,
        message: `Route ${req.originalUrl} not found`,
        error: {
            code: 'NOT_FOUND'
        }
    };
    res.status(404).json(response);
};