/**
 * Menu Routes
 * Routes for menu item management
 */

const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const { protect, optionalAuth } = require('../middleware/auth');
const { validate, sanitizeBody } = require('../middleware/validation');
const { menuValidation, idParamValidation } = require('../utils/validation');

// Apply sanitization to all routes
router.use(sanitizeBody);

/**
 * @route   GET /api/menu
 * @desc    Get all menu items
 * @access  Public (shows only active) / Protected (shows all)
 */
router.get('/', optionalAuth, menuController.getAllMenuItems);

/**
 * @route   GET /api/menu/:id
 * @desc    Get menu item by ID
 * @access  Protected
 */
router.get('/:id', protect, idParamValidation, validate, menuController.getMenuItemById);

/**
 * @route   POST /api/menu
 * @desc    Create new menu item
 * @access  Protected
 */
router.post('/', protect, menuValidation, validate, menuController.createMenuItem);

/**
 * @route   PUT /api/menu/reorder
 * @desc    Reorder menu items
 * @access  Protected
 */
router.put('/reorder', protect, menuController.reorderMenuItems);

/**
 * @route   PUT /api/menu/:id
 * @desc    Update menu item
 * @access  Protected
 */
router.put('/:id', protect, idParamValidation, validate, menuController.updateMenuItem);

/**
 * @route   DELETE /api/menu/:id
 * @desc    Delete menu item
 * @access  Protected
 */
router.delete('/:id', protect, idParamValidation, validate, menuController.deleteMenuItem);

module.exports = router;
