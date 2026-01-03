/**
 * User Routes
 * Routes for admin user management
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/roleCheck');
const { validate, sanitizeBody } = require('../middleware/validation');
const { registerValidation, userUpdateValidation, idParamValidation, paginationValidation } = require('../utils/validation');

// Apply sanitization to all routes
router.use(sanitizeBody);

// All routes are protected and require admin role
router.use(protect);
router.use(adminOnly);

/**
 * @route   GET /api/users
 * @desc    Get all users
 * @access  Protected (Admin only)
 */
router.get('/', paginationValidation, validate, userController.getAllUsers);

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Protected (Admin only)
 */
router.get('/:id', idParamValidation, validate, userController.getUserById);

/**
 * @route   POST /api/users
 * @desc    Create new user
 * @access  Protected (Admin only)
 */
router.post('/', registerValidation, validate, userController.createUser);

/**
 * @route   PUT /api/users/:id
 * @desc    Update user
 * @access  Protected (Admin only)
 */
router.put('/:id', idParamValidation, userUpdateValidation, validate, userController.updateUser);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user
 * @access  Protected (Admin only)
 */
router.delete('/:id', idParamValidation, validate, userController.deleteUser);

/**
 * @route   PUT /api/users/:id/status
 * @desc    Change user status
 * @access  Protected (Admin only)
 */
router.put('/:id/status', idParamValidation, validate, userController.changeUserStatus);

module.exports = router;
