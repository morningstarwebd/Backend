/**
 * Stats Routes
 * Routes for dashboard statistics
 */

const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

/**
 * @route   GET /api/stats
 * @desc    Get dashboard statistics
 * @access  Protected
 */
router.get('/', statsController.getDashboardStats);

/**
 * @route   GET /api/stats/overview
 * @desc    Get detailed overview statistics
 * @access  Protected
 */
router.get('/overview', statsController.getOverviewStats);

/**
 * @route   GET /api/stats/recent
 * @desc    Get recent activities
 * @access  Protected
 */
router.get('/recent', statsController.getRecentActivities);

module.exports = router;
