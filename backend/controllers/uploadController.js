/**
 * Upload Controller
 * Handles image upload to Cloudinary and storage tracking
 */

const { SHEETS, getAll, getById, create, remove } = require('../utils/sheetHelper');
const { uploadImage, uploadMultipleImages, deleteImage } = require('../config/cloudinary');
const { generateId } = require('../utils/generateId');
const {
    successResponse,
    errorResponse,
    createdResponse,
    notFoundResponse,
    paginatedResponse
} = require('../utils/response');

/**
 * Upload single image
 * POST /api/upload/single
 */
const uploadSingleImage = async (req, res) => {
    try {
        if (!req.file) {
            return errorResponse(res, 'No image file provided', 400);
        }

        // Convert buffer to base64 for Cloudinary upload
        const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

        // Upload to Cloudinary
        const uploadResult = await uploadImage(base64Image, {
            folder: 'backend-uploads'
        });

        // Save to images sheet
        const imageData = {
            id: generateId('img'),
            filename: req.file.originalname,
            url: uploadResult.url,
            cloudinary_id: uploadResult.public_id,
            size: uploadResult.size?.toString() || req.file.size.toString(),
            width: uploadResult.width?.toString() || '',
            height: uploadResult.height?.toString() || '',
            format: uploadResult.format || req.file.mimetype.split('/')[1],
            upload_date: new Date().toISOString()
        };

        await create(SHEETS.IMAGES, imageData);

        return createdResponse(res, {
            ...imageData,
            url: uploadResult.url
        }, 'Image uploaded successfully');
    } catch (error) {
        console.error('Upload single image error:', error.message);
        return errorResponse(res, 'Failed to upload image', 500);
    }
};

/**
 * Upload multiple images
 * POST /api/upload/multiple
 */
const uploadMultipleImagesHandler = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return errorResponse(res, 'No image files provided', 400);
        }

        const uploadedImages = [];

        for (const file of req.files) {
            try {
                // Convert buffer to base64
                const base64Image = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

                // Upload to Cloudinary
                const uploadResult = await uploadImage(base64Image, {
                    folder: 'backend-uploads'
                });

                // Save to images sheet
                const imageData = {
                    id: generateId('img'),
                    filename: file.originalname,
                    url: uploadResult.url,
                    cloudinary_id: uploadResult.public_id,
                    size: uploadResult.size?.toString() || file.size.toString(),
                    width: uploadResult.width?.toString() || '',
                    height: uploadResult.height?.toString() || '',
                    format: uploadResult.format || file.mimetype.split('/')[1],
                    upload_date: new Date().toISOString()
                };

                await create(SHEETS.IMAGES, imageData);
                uploadedImages.push(imageData);
            } catch (err) {
                console.error(`Failed to upload ${file.originalname}:`, err.message);
            }
        }

        if (uploadedImages.length === 0) {
            return errorResponse(res, 'Failed to upload any images', 500);
        }

        return createdResponse(res, {
            uploaded: uploadedImages.length,
            total: req.files.length,
            images: uploadedImages
        }, `${uploadedImages.length} of ${req.files.length} images uploaded successfully`);
    } catch (error) {
        console.error('Upload multiple images error:', error.message);
        return errorResponse(res, 'Failed to upload images', 500);
    }
};

/**
 * Get all uploaded images
 * GET /api/images
 */
const getAllImages = async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;

        const result = await getAll(SHEETS.IMAGES, {
            page: parseInt(page),
            limit: parseInt(limit),
            sortBy: 'upload_date',
            sortOrder: 'desc'
        });

        return paginatedResponse(res, result.data, result.pagination, 'Images retrieved successfully');
    } catch (error) {
        console.error('Get all images error:', error.message);
        return errorResponse(res, 'Failed to retrieve images', 500);
    }
};

/**
 * Get image by ID
 * GET /api/images/:id
 */
const getImageById = async (req, res) => {
    try {
        const { id } = req.params;
        const image = await getById(SHEETS.IMAGES, id);

        if (!image) {
            return notFoundResponse(res, 'Image');
        }

        return successResponse(res, image, 'Image retrieved successfully');
    } catch (error) {
        console.error('Get image by ID error:', error.message);
        return errorResponse(res, 'Failed to retrieve image', 500);
    }
};

/**
 * Delete image
 * DELETE /api/images/:id
 */
const deleteImageHandler = async (req, res) => {
    try {
        const { id } = req.params;

        const existing = await getById(SHEETS.IMAGES, id);
        if (!existing) {
            return notFoundResponse(res, 'Image');
        }

        // Delete from Cloudinary
        if (existing.cloudinary_id) {
            try {
                await deleteImage(existing.cloudinary_id);
            } catch (cloudinaryError) {
                console.error('Cloudinary delete error:', cloudinaryError.message);
                // Continue with sheet deletion even if Cloudinary fails
            }
        }

        // Delete from sheet
        await remove(SHEETS.IMAGES, id);

        return successResponse(res, null, 'Image deleted successfully');
    } catch (error) {
        console.error('Delete image error:', error.message);
        return errorResponse(res, 'Failed to delete image', 500);
    }
};

/**
 * Delete multiple images
 * DELETE /api/images
 */
const deleteMultipleImagesHandler = async (req, res) => {
    try {
        const { ids } = req.body;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return errorResponse(res, 'Image IDs array is required', 400);
        }

        let deletedCount = 0;

        for (const id of ids) {
            try {
                const existing = await getById(SHEETS.IMAGES, id);
                if (existing) {
                    // Delete from Cloudinary
                    if (existing.cloudinary_id) {
                        try {
                            await deleteImage(existing.cloudinary_id);
                        } catch (cloudinaryError) {
                            console.error(`Cloudinary delete error for ${id}:`, cloudinaryError.message);
                        }
                    }
                    // Delete from sheet
                    await remove(SHEETS.IMAGES, id);
                    deletedCount++;
                }
            } catch (err) {
                console.error(`Failed to delete image ${id}:`, err.message);
            }
        }

        return successResponse(res, {
            deleted: deletedCount,
            total: ids.length
        }, `${deletedCount} of ${ids.length} images deleted successfully`);
    } catch (error) {
        console.error('Delete multiple images error:', error.message);
        return errorResponse(res, 'Failed to delete images', 500);
    }
};

module.exports = {
    uploadSingleImage,
    uploadMultipleImages: uploadMultipleImagesHandler,
    getAllImages,
    getImageById,
    deleteImage: deleteImageHandler,
    deleteMultipleImages: deleteMultipleImagesHandler
};
