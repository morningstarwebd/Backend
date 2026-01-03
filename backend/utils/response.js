/**
 * Response Utility
 * Standardized API response helpers
 */

/**
 * Send a success response
 * @param {Object} res - Express response object
 * @param {*} data - Response data
 * @param {string} message - Success message
 * @param {number} statusCode - HTTP status code (default: 200)
 */
function successResponse(res, data = null, message = 'Success', statusCode = 200) {
    const response = {
        success: true,
        message
    };

    if (data !== null) {
        response.data = data;
    }

    return res.status(statusCode).json(response);
}

/**
 * Send an error response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code (default: 400)
 * @param {*} errors - Detailed errors (optional)
 */
function errorResponse(res, message = 'Error', statusCode = 400, errors = null) {
    const response = {
        success: false,
        message
    };

    if (errors) {
        response.errors = errors;
    }

    // Add stack trace in development
    if (process.env.NODE_ENV === 'development' && errors instanceof Error) {
        response.stack = errors.stack;
    }

    return res.status(statusCode).json(response);
}

/**
 * Send a paginated response
 * @param {Object} res - Express response object
 * @param {Array} data - Array of items
 * @param {Object} pagination - Pagination info
 * @param {string} message - Success message
 */
function paginatedResponse(res, data, pagination, message = 'Data retrieved successfully') {
    return res.status(200).json({
        success: true,
        message,
        data,
        pagination
    });
}

/**
 * Send a created response (201)
 * @param {Object} res - Express response object
 * @param {*} data - Created resource data
 * @param {string} message - Success message
 */
function createdResponse(res, data, message = 'Resource created successfully') {
    return successResponse(res, data, message, 201);
}

/**
 * Send a no content response (204)
 * @param {Object} res - Express response object
 */
function noContentResponse(res) {
    return res.status(204).send();
}

/**
 * Send a not found response (404)
 * @param {Object} res - Express response object
 * @param {string} resource - Resource name
 */
function notFoundResponse(res, resource = 'Resource') {
    return errorResponse(res, `${resource} not found`, 404);
}

/**
 * Send an unauthorized response (401)
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 */
function unauthorizedResponse(res, message = 'Unauthorized access') {
    return errorResponse(res, message, 401);
}

/**
 * Send a forbidden response (403)
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 */
function forbiddenResponse(res, message = 'Access forbidden') {
    return errorResponse(res, message, 403);
}

/**
 * Send a validation error response (400)
 * @param {Object} res - Express response object
 * @param {Array} errors - Validation errors
 */
function validationErrorResponse(res, errors) {
    return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
    });
}

/**
 * Send a conflict response (409)
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 */
function conflictResponse(res, message = 'Resource already exists') {
    return errorResponse(res, message, 409);
}

/**
 * Send a server error response (500)
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {Error} error - Error object (for logging)
 */
function serverErrorResponse(res, message = 'Internal server error', error = null) {
    if (error) {
        console.error('Server Error:', error);
    }

    const response = {
        success: false,
        message
    };

    if (process.env.NODE_ENV === 'development' && error) {
        response.error = error.message;
        response.stack = error.stack;
    }

    return res.status(500).json(response);
}

module.exports = {
    successResponse,
    errorResponse,
    paginatedResponse,
    createdResponse,
    noContentResponse,
    notFoundResponse,
    unauthorizedResponse,
    forbiddenResponse,
    validationErrorResponse,
    conflictResponse,
    serverErrorResponse
};
