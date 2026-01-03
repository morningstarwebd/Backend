/**
 * Fund Routes
 * Routes for Fund management
 */

const express = require('express');
const router = express.Router();
const fundController = require('../controllers/fundController');
const { protect } = require('../middleware/auth');
const { validate, sanitizeBody } = require('../middleware/validation');
// You might want to add specific validation for funds later

// Apply sanitization
router.use(sanitizeBody);

/**
 * @route   POST /api/fund
 * @desc    Submit a new fund contribution
 * @access  Public
 */
router.post('/', validate, fundController.submitFund);

/**
 * @route   GET /api/fund
 * @desc    Get all fund requests
 * @access  Protected (Admin only)
 */
router.get('/', protect, fundController.getAllFunds);

module.exports = router;
