/**
 * Error Handler Middleware
 * Centralized error handling for the application
 */

/**
 * Custom API Error class
 */
class ApiError extends Error {
    constructor(message, statusCode, errors = null) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Create validation error
 */
const createValidationError = (errors) => {
    return new ApiError('Validation failed', 400, errors);
};

/**
 * Create not found error
 */
const createNotFoundError = (resource = 'Resource') => {
    return new ApiError(`${resource} not found`, 404);
};

/**
 * Create unauthorized error
 */
const createUnauthorizedError = (message = 'Unauthorized access') => {
    return new ApiError(message, 401);
};

/**
 * Create forbidden error
 */
const createForbiddenError = (message = 'Access forbidden') => {
    return new ApiError(message, 403);
};

/**
 * Create conflict error
 */
const createConflictError = (message = 'Resource already exists') => {
    return new ApiError(message, 409);
};

/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
    // Log error for debugging
    console.error('Error:', {
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        path: req.path,
        method: req.method
    });

    // Default error values
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';
    let errors = err.errors || null;

    // Handle specific error types
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = 'Validation Error';
    }

    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token';
    }

    if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token expired';
    }

    if (err.code === 'LIMIT_FILE_SIZE') {
        statusCode = 400;
        message = 'File too large';
    }

    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        statusCode = 400;
        message = 'Unexpected file upload';
    }

    // Google Sheets API errors
    if (err.code === 403 && err.message?.includes('Google')) {
        statusCode = 503;
        message = 'Database service temporarily unavailable';
    }

    // Cloudinary errors
    if (err.http_code) {
        statusCode = err.http_code;
        message = err.message || 'Image upload failed';
    }

    // Build error response
    const errorResponse = {
        success: false,
        message,
        ...(errors && { errors }),
        ...(process.env.NODE_ENV === 'development' && {
            stack: err.stack,
            detail: err.message
        })
    };

    res.status(statusCode).json(errorResponse);
};

/**
 * Async handler wrapper to catch errors
 */
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Not found handler for undefined routes
 */
const notFoundHandler = (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    });
};

module.exports = {
    ApiError,
    createValidationError,
    createNotFoundError,
    createUnauthorizedError,
    createForbiddenError,
    createConflictError,
    errorHandler,
    asyncHandler,
    notFoundHandler
};
