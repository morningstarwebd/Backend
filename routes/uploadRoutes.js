/**
 * Upload Routes
 * Routes for image upload and management
 */

const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const { protect } = require('../middleware/auth');
const { uploadSingleImage, uploadMultipleImages } = require('../middleware/upload');
const { validate } = require('../middleware/validation');
const { idParamValidation, paginationValidation } = require('../utils/validation');

/**
 * @route   POST /api/upload/single
 * @desc    Upload single image
 * @access  Protected
 */
router.post('/single', protect, uploadSingleImage, uploadController.uploadSingleImage);

/**
 * @route   POST /api/upload/multiple
 * @desc    Upload multiple images
 * @access  Protected
 */
router.post('/multiple', protect, uploadMultipleImages(10), uploadController.uploadMultipleImages);

/**
 * @route   GET /api/images
 * @desc    Get all uploaded images
 * @access  Protected
 */
router.get('/', protect, paginationValidation, validate, uploadController.getAllImages);

/**
 * @route   GET /api/images/:id
 * @desc    Get image by ID
 * @access  Protected
 */
router.get('/:id', protect, idParamValidation, validate, uploadController.getImageById);

/**
 * @route   DELETE /api/images/:id
 * @desc    Delete single image
 * @access  Protected
 */
router.delete('/:id', protect, idParamValidation, validate, uploadController.deleteImage);

/**
 * @route   DELETE /api/images
 * @desc    Delete multiple images
 * @access  Protected
 */
router.delete('/', protect, uploadController.deleteMultipleImages);

module.exports = router;
