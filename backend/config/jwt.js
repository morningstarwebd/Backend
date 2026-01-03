/**
 * JWT Configuration
 * Configuration and helper functions for JSON Web Tokens
 */

const jwt = require('jsonwebtoken');

// JWT Configuration
const JWT_CONFIG = {
    secret: process.env.JWT_SECRET || 'your-default-secret-change-in-production',
    expiresIn: process.env.JWT_EXPIRE || '30d',
    issuer: 'backend-api',
    algorithm: 'HS256'
};

/**
 * Generate JWT token
 * @param {Object} payload - Token payload
 * @returns {string} JWT token
 */
function generateToken(payload) {
    return jwt.sign(payload, JWT_CONFIG.secret, {
        expiresIn: JWT_CONFIG.expiresIn,
        issuer: JWT_CONFIG.issuer,
        algorithm: JWT_CONFIG.algorithm
    });
}

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token payload
 */
function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_CONFIG.secret, {
            issuer: JWT_CONFIG.issuer,
            algorithms: [JWT_CONFIG.algorithm]
        });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new Error('Token has expired');
        }
        if (error.name === 'JsonWebTokenError') {
            throw new Error('Invalid token');
        }
        throw error;
    }
}

/**
 * Decode token without verification
 * @param {string} token - JWT token
 * @returns {Object|null} Decoded payload or null
 */
function decodeToken(token) {
    return jwt.decode(token);
}

/**
 * Generate refresh token (longer expiry)
 * @param {Object} payload - Token payload
 * @returns {string} Refresh token
 */
function generateRefreshToken(payload) {
    return jwt.sign(payload, JWT_CONFIG.secret, {
        expiresIn: '30d',
        issuer: JWT_CONFIG.issuer,
        algorithm: JWT_CONFIG.algorithm
    });
}

/**
 * Get token expiration time in seconds
 * @param {string} token - JWT token
 * @returns {number|null} Expiration timestamp or null
 */
function getTokenExpiration(token) {
    const decoded = jwt.decode(token);
    return decoded ? decoded.exp : null;
}

module.exports = {
    JWT_CONFIG,
    generateToken,
    verifyToken,
    decodeToken,
    generateRefreshToken,
    getTokenExpiration
};
