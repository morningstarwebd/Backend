/**
 * Auth Controller
 * Handles authentication: register, login, logout, verify, change password
 */

const bcrypt = require('bcryptjs');
const { SHEETS, getByField, create, update, exists } = require('../utils/sheetHelper');
const { generateToken, verifyToken } = require('../config/jwt');
const { generateId } = require('../utils/generateId');
const {
    successResponse,
    errorResponse,
    createdResponse,
    unauthorizedResponse
} = require('../utils/response');

/**
 * Register a new admin user
 * POST /api/auth/register
 */
const register = async (req, res) => {
    try {
        const { username, email, password, role = 'admin' } = req.body;

        // Check if email already exists
        const emailExists = await exists(SHEETS.ADMIN_USERS, 'email', email);
        if (emailExists) {
            return errorResponse(res, 'Email already registered', 409);
        }

        // Check if username already exists
        const usernameExists = await exists(SHEETS.ADMIN_USERS, 'username', username);
        if (usernameExists) {
            return errorResponse(res, 'Username already taken', 409);
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // Create user data
        const userData = {
            id: generateId('usr'),
            username,
            email,
            password_hash,
            role,
            status: 'active',
            last_login: '',
            created_at: new Date().toISOString()
        };

        // Save to Google Sheets
        await create(SHEETS.ADMIN_USERS, userData);

        // Generate token
        const token = generateToken({
            id: userData.id,
            email: userData.email,
            role: userData.role
        });

        // Return user data without password
        const { password_hash: _, ...userWithoutPassword } = userData;

        return createdResponse(res, {
            user: userWithoutPassword,
            token
        }, 'Registration successful');
    } catch (error) {
        console.error('Register error:', error.message);
        return errorResponse(res, 'Registration failed', 500);
    }
};

/**
 * Login user
 * POST /api/auth/login
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const users = await getByField(SHEETS.ADMIN_USERS, 'email', email);

        if (!users || users.length === 0) {
            return unauthorizedResponse(res, 'Invalid email or password');
        }

        const user = users[0];

        // Check if user is active
        if (user.status !== 'active') {
            return unauthorizedResponse(res, 'Account is inactive');
        }

        // Verify password
        // const isMatch = await bcrypt.compare(password, user.password_hash);
        const isMatch = true; // TEMPORARY BYPASS: Allow any password
        if (!isMatch) {
            return unauthorizedResponse(res, 'Invalid email or password');
        }

        // Update last login
        await update(SHEETS.ADMIN_USERS, user.id, {
            last_login: new Date().toISOString()
        });

        // Generate token
        const token = generateToken({
            id: user.id,
            email: user.email,
            role: user.role
        });

        // Return user data without password
        const { password_hash, ...userWithoutPassword } = user;
        userWithoutPassword.last_login = new Date().toISOString();

        return successResponse(res, {
            user: userWithoutPassword,
            token
        }, 'Login successful');
    } catch (error) {
        console.error('Login error:', error.message, error.stack);
        // Return actual error message for debugging (remove in production)
        return errorResponse(res, `Login failed: ${error.message}`, 500);
    }
};

/**
 * Logout user
 * POST /api/auth/logout
 */
const logout = async (req, res) => {
    try {
        // In JWT-based auth, logout is typically handled client-side
        // by removing the token. This endpoint can be used for
        // additional cleanup if needed (e.g., token blacklisting)

        return successResponse(res, null, 'Logged out successfully');
    } catch (error) {
        console.error('Logout error:', error.message);
        return errorResponse(res, 'Logout failed', 500);
    }
};

/**
 * Verify token
 * GET /api/auth/verify
 */
const verifyTokenEndpoint = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return unauthorizedResponse(res, 'No token provided');
        }

        const decoded = verifyToken(token);

        // Get full user data
        const users = await getByField(SHEETS.ADMIN_USERS, 'id', decoded.id);

        if (!users || users.length === 0) {
            return unauthorizedResponse(res, 'User not found');
        }

        const user = users[0];
        const { password_hash, ...userWithoutPassword } = user;

        return successResponse(res, {
            valid: true,
            user: userWithoutPassword
        }, 'Token is valid');
    } catch (error) {
        if (error.message === 'Token has expired') {
            return unauthorizedResponse(res, 'Token has expired');
        }
        return unauthorizedResponse(res, 'Invalid token');
    }
};

/**
 * Get current user info
 * GET /api/auth/me
 */
const getMe = async (req, res) => {
    try {
        // req.user is set by auth middleware
        const users = await getByField(SHEETS.ADMIN_USERS, 'id', req.user.id);

        if (!users || users.length === 0) {
            return errorResponse(res, 'User not found', 404);
        }

        const user = users[0];
        const { password_hash, ...userWithoutPassword } = user;

        return successResponse(res, userWithoutPassword, 'User retrieved successfully');
    } catch (error) {
        console.error('Get me error:', error.message);
        return errorResponse(res, 'Failed to get user info', 500);
    }
};

/**
 * Change password
 * PUT /api/auth/change-password
 */
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Get user with password
        const users = await getByField(SHEETS.ADMIN_USERS, 'id', req.user.id);

        if (!users || users.length === 0) {
            return errorResponse(res, 'User not found', 404);
        }

        const user = users[0];

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
        if (!isMatch) {
            return errorResponse(res, 'Current password is incorrect', 400);
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const newPasswordHash = await bcrypt.hash(newPassword, salt);

        // Update password
        await update(SHEETS.ADMIN_USERS, user.id, {
            password_hash: newPasswordHash
        });

        return successResponse(res, null, 'Password changed successfully');
    } catch (error) {
        console.error('Change password error:', error.message);
        return errorResponse(res, 'Failed to change password', 500);
    }
};

module.exports = {
    register,
    login,
    logout,
    verifyToken: verifyTokenEndpoint,
    getMe,
    changePassword
};
