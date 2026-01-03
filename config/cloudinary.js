/**
 * Cloudinary Configuration
 * Handles image upload, optimization, and deletion
 */

const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Upload image to Cloudinary
 * @param {string} filePath - Path to the file or base64 string
 * @param {Object} options - Upload options
 * @returns {Promise<Object>} Upload result
 */
async function uploadImage(filePath, options = {}) {
    try {
        const defaultOptions = {
            folder: 'backend-uploads',
            resource_type: 'auto',
            transformation: [
                { quality: 'auto:good' },
                { fetch_format: 'auto' }
            ]
        };

        const uploadOptions = { ...defaultOptions, ...options };
        const result = await cloudinary.uploader.upload(filePath, uploadOptions);

        return {
            public_id: result.public_id,
            url: result.secure_url,
            width: result.width,
            height: result.height,
            format: result.format,
            size: result.bytes
        };
    } catch (error) {
        console.error('Cloudinary upload error:', error.message);
        throw new Error('Failed to upload image to Cloudinary');
    }
}

/**
 * Upload multiple images to Cloudinary
 * @param {Array} filePaths - Array of file paths
 * @param {Object} options - Upload options
 * @returns {Promise<Array>} Array of upload results
 */
async function uploadMultipleImages(filePaths, options = {}) {
    try {
        const uploadPromises = filePaths.map(filePath => uploadImage(filePath, options));
        const results = await Promise.all(uploadPromises);
        return results;
    } catch (error) {
        console.error('Cloudinary multiple upload error:', error.message);
        throw new Error('Failed to upload images to Cloudinary');
    }
}

/**
 * Delete image from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @returns {Promise<Object>} Deletion result
 */
async function deleteImage(publicId) {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        console.error('Cloudinary delete error:', error.message);
        throw new Error('Failed to delete image from Cloudinary');
    }
}

/**
 * Delete multiple images from Cloudinary
 * @param {Array} publicIds - Array of Cloudinary public IDs
 * @returns {Promise<Object>} Deletion result
 */
async function deleteMultipleImages(publicIds) {
    try {
        const result = await cloudinary.api.delete_resources(publicIds);
        return result;
    } catch (error) {
        console.error('Cloudinary multiple delete error:', error.message);
        throw new Error('Failed to delete images from Cloudinary');
    }
}

/**
 * Get optimized image URL
 * @param {string} publicId - Cloudinary public ID
 * @param {Object} transformations - Image transformations
 * @returns {string} Optimized URL
 */
function getOptimizedUrl(publicId, transformations = {}) {
    const defaultTransformations = {
        quality: 'auto',
        fetch_format: 'auto'
    };

    return cloudinary.url(publicId, {
        ...defaultTransformations,
        ...transformations
    });
}

/**
 * Get thumbnail URL
 * @param {string} publicId - Cloudinary public ID
 * @param {number} width - Thumbnail width
 * @param {number} height - Thumbnail height
 * @returns {string} Thumbnail URL
 */
function getThumbnailUrl(publicId, width = 150, height = 150) {
    return cloudinary.url(publicId, {
        width,
        height,
        crop: 'fill',
        gravity: 'auto',
        quality: 'auto',
        fetch_format: 'auto'
    });
}

module.exports = {
    cloudinary,
    uploadImage,
    uploadMultipleImages,
    deleteImage,
    deleteMultipleImages,
    getOptimizedUrl,
    getThumbnailUrl
};
