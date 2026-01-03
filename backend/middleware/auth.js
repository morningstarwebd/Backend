/**
 * Authentication Middleware
 * Verifies JWT token and attaches user to request
 */

const { verifyToken } = require('../config/jwt');
const { SHEETS, findByField } = require('../config/googleSheets');
const { errorResponse } = require('../utils/response');

/**
 * Protect routes - require valid JWT token
 */
const protect = async (req, res, next) => {
    try {
        let token;

        // Check for token in Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        // Also check for token in cookies (optional)
        else if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }

        // Check if token exists
        if (!token) {
            return errorResponse(res, 'Not authorized, no token provided', 401);
        }

        try {
            // Verify token
            const decoded = verifyToken(token);

            // Trust the token payload directly for better stability
            // This avoids Google Sheets API calls on every request
            req.user = {
                id: decoded.id,
                email: decoded.email,
                role: decoded.role || 'admin',
                // Default status to active since they have a valid token
                // In a real DB we might check cache, but Google Sheets is too slow/unreliable for per-request checks
                status: 'active'
            };

            // Optional: You could implement a background verify or a cached verify here if strict security is needed
            // But for this use case, trusting the valid signed JWT is sufficient and much more stable.

            next();
        } catch (error) {
            if (error.message === 'Token has expired') {
                return errorResponse(res, 'Token has expired, please login again', 401);
            }
            return errorResponse(res, 'Not authorized, invalid token', 401);
        }
    } catch (error) {
        console.error('Auth middleware error:', error.message);
        return errorResponse(res, 'Authentication error', 500);
    }
};

/**
 * Optional authentication - doesn't block, but attaches user if token is valid
 */
const optionalAuth = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (token) {
            try {
                const decoded = verifyToken(token);
                const users = await findByField(SHEETS.ADMIN_USERS, 'id', decoded.id);

                if (users && users.length > 0) {
                    const user = users[0];
                    req.user = {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        role: user.role,
                        status: user.status
                    };
                }
            } catch (error) {
                // Token invalid, but we don't block the request
                req.user = null;
            }
        }

        next();
    } catch (error) {
        next();
    }
};

module.exports = { protect, optionalAuth };
