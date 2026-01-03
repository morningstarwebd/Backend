/**
 * Auth Routes
 * Routes for authentication endpoints
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const { sanitizeBody } = require('../middleware/validation');
const {
    registerValidation,
    loginValidation,
    changePasswordValidation
} = require('../utils/validation');
const roleCheck = require('../middleware/roleCheck');

// Apply sanitization to all routes
router.use(sanitizeBody);

/**
 * @route   POST /api/auth/register
 * @desc    Register a new admin user
 * @access  Protected (requires existing admin)
 */
router.post('/register', protect, roleCheck(['super_admin']), registerValidation, validate, authController.register);

/**
 * @route   POST /api/auth/register/public
 * @desc    Register a new user (public)
 * @access  Public
 */
router.post('/register/public', registerValidation, validate, authController.publicRegister);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', loginValidation, validate, authController.login);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Protected
 */
router.post('/logout', protect, authController.logout);

/**
 * @route   GET /api/auth/verify
 * @desc    Verify JWT token
 * @access  Public (with token)
 */
router.get('/verify', authController.verifyToken);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user info
 * @access  Protected
 */
router.get('/me', protect, authController.getMe);

/**
 * @route   PUT /api/auth/change-password
 * @desc    Change user password
 * @access  Protected
 */
router.put('/change-password', protect, changePasswordValidation, validate, authController.changePassword);

module.exports = router;
