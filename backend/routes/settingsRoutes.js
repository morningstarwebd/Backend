/**
 * Settings Routes
 * Routes for application settings management
 */

const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const { protect } = require('../middleware/auth');
const { validate, sanitizeBody } = require('../middleware/validation');
const { settingsValidation } = require('../utils/validation');

// Apply sanitization to all routes
router.use(sanitizeBody);

/**
 * @route   GET /api/settings
 * @desc    Get all settings
 * @access  Protected
 */
router.get('/', protect, settingsController.getAllSettings);

/**
 * @route   GET /api/settings/:key
 * @desc    Get setting by key
 * @access  Protected
 */
router.get('/:key', protect, settingsController.getSettingByKey);

/**
 * @route   PUT /api/settings
 * @desc    Bulk update settings
 * @access  Protected
 */
router.put('/', protect, settingsController.bulkUpdateSettings);

/**
 * @route   PUT /api/settings/:key
 * @desc    Update single setting
 * @access  Protected
 */
router.put('/:key', protect, settingsController.updateSetting);

module.exports = router;
