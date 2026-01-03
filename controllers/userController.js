/**
 * User Controller
 * Handles admin user management CRUD operations
 */

const bcrypt = require('bcryptjs');
const { SHEETS, getAll, getById, getByField, create, update, remove, exists } = require('../utils/sheetHelper');
const { generateId } = require('../utils/generateId');
const {
    successResponse,
    errorResponse,
    createdResponse,
    notFoundResponse,
    paginatedResponse
} = require('../utils/response');

/**
 * Get all users
 * GET /api/users
 */
const getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10, role, status, search } = req.query;

        const filters = {};
        if (role) filters.role = role;
        if (status) filters.status = status;

        const result = await getAll(SHEETS.ADMIN_USERS, {
            page: parseInt(page),
            limit: parseInt(limit),
            sortBy: 'created_at',
            sortOrder: 'desc',
            filters
        });

        // Remove password from results and filter by search
        let data = result.data.map(user => {
            const { password_hash, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });

        if (search) {
            const searchLower = search.toLowerCase();
            data = data.filter(user =>
                user.username?.toLowerCase().includes(searchLower) ||
                user.email?.toLowerCase().includes(searchLower)
            );
        }

        return paginatedResponse(res, data, result.pagination, 'Users retrieved successfully');
    } catch (error) {
        console.error('Get all users error:', error.message);
        return errorResponse(res, 'Failed to retrieve users', 500);
    }
};

/**
 * Get user by ID
 * GET /api/users/:id
 */
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await getById(SHEETS.ADMIN_USERS, id);

        if (!user) {
            return notFoundResponse(res, 'User');
        }

        const { password_hash, ...userWithoutPassword } = user;
        return successResponse(res, userWithoutPassword, 'User retrieved successfully');
    } catch (error) {
        console.error('Get user by ID error:', error.message);
        return errorResponse(res, 'Failed to retrieve user', 500);
    }
};

/**
 * Create new user
 * POST /api/users
 */
const createUser = async (req, res) => {
    try {
        const { username, email, password, role = 'admin', status = 'active' } = req.body;

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

        const userData = {
            id: generateId('usr'),
            username,
            email,
            password_hash,
            role,
            status,
            last_login: ''
        };

        await create(SHEETS.ADMIN_USERS, userData);

        const { password_hash: _, ...userWithoutPassword } = userData;
        return createdResponse(res, userWithoutPassword, 'User created successfully');
    } catch (error) {
        console.error('Create user error:', error.message);
        return errorResponse(res, 'Failed to create user', 500);
    }
};

/**
 * Update user
 * PUT /api/users/:id
 */
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const existing = await getById(SHEETS.ADMIN_USERS, id);
        if (!existing) {
            return notFoundResponse(res, 'User');
        }

        // Check email uniqueness if updating email
        if (updates.email && updates.email !== existing.email) {
            const emailExists = await exists(SHEETS.ADMIN_USERS, 'email', updates.email, id);
            if (emailExists) {
                return errorResponse(res, 'Email already registered', 409);
            }
        }

        // Check username uniqueness if updating username
        if (updates.username && updates.username !== existing.username) {
            const usernameExists = await exists(SHEETS.ADMIN_USERS, 'username', updates.username, id);
            if (usernameExists) {
                return errorResponse(res, 'Username already taken', 409);
            }
        }

        // Hash new password if provided
        if (updates.password) {
            const salt = await bcrypt.genSalt(10);
            updates.password_hash = await bcrypt.hash(updates.password, salt);
            delete updates.password;
        }

        const updatedUser = await update(SHEETS.ADMIN_USERS, id, updates);
        const { password_hash, ...userWithoutPassword } = updatedUser;

        return successResponse(res, userWithoutPassword, 'User updated successfully');
    } catch (error) {
        console.error('Update user error:', error.message);
        return errorResponse(res, 'Failed to update user', 500);
    }
};

/**
 * Delete user
 * DELETE /api/users/:id
 */
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Prevent self-deletion
        if (req.user && req.user.id === id) {
            return errorResponse(res, 'Cannot delete your own account', 400);
        }

        const existing = await getById(SHEETS.ADMIN_USERS, id);
        if (!existing) {
            return notFoundResponse(res, 'User');
        }

        await remove(SHEETS.ADMIN_USERS, id);
        return successResponse(res, null, 'User deleted successfully');
    } catch (error) {
        console.error('Delete user error:', error.message);
        return errorResponse(res, 'Failed to delete user', 500);
    }
};

/**
 * Change user status
 * PUT /api/users/:id/status
 */
const changeUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Prevent self-status change
        if (req.user && req.user.id === id) {
            return errorResponse(res, 'Cannot change your own status', 400);
        }

        if (!['active', 'inactive'].includes(status)) {
            return errorResponse(res, 'Invalid status. Must be active or inactive', 400);
        }

        const existing = await getById(SHEETS.ADMIN_USERS, id);
        if (!existing) {
            return notFoundResponse(res, 'User');
        }

        const updatedUser = await update(SHEETS.ADMIN_USERS, id, { status });
        const { password_hash, ...userWithoutPassword } = updatedUser;

        return successResponse(res, userWithoutPassword, 'User status updated successfully');
    } catch (error) {
        console.error('Change user status error:', error.message);
        return errorResponse(res, 'Failed to change user status', 500);
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    changeUserStatus
};
