/**
 * Upload Middleware
 * Multer configuration for file uploads
 */

const multer = require('multer');
const path = require('path');

// Allowed file types
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
const ALLOWED_DOCUMENT_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

// Max file sizes (in bytes)
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Storage configuration for memory storage
 * Files are stored in memory as Buffer objects
 * This is efficient for direct upload to cloud services
 */
const memoryStorage = multer.memoryStorage();

/**
 * Storage configuration for disk storage
 * Files are stored on disk temporarily
 */
const diskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

/**
 * File filter for images
 */
const imageFilter = (req, file, cb) => {
    if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'), false);
    }
};

/**
 * File filter for documents
 */
const documentFilter = (req, file, cb) => {
    if (ALLOWED_DOCUMENT_TYPES.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only PDF and Word documents are allowed.'), false);
    }
};

/**
 * File filter for both images and documents
 */
const mixedFilter = (req, file, cb) => {
    if ([...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOCUMENT_TYPES].includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type.'), false);
    }
};

/**
 * Single image upload middleware
 * Uses memory storage for Cloudinary upload
 */
const uploadSingleImage = multer({
    storage: memoryStorage,
    limits: {
        fileSize: MAX_IMAGE_SIZE
    },
    fileFilter: imageFilter
}).single('image');

/**
 * Multiple images upload middleware
 * @param {number} maxCount - Maximum number of files (default: 10)
 */
const uploadMultipleImages = (maxCount = 10) => multer({
    storage: memoryStorage,
    limits: {
        fileSize: MAX_IMAGE_SIZE
    },
    fileFilter: imageFilter
}).array('images', maxCount);

/**
 * Single document upload middleware
 */
const uploadSingleDocument = multer({
    storage: diskStorage,
    limits: {
        fileSize: MAX_DOCUMENT_SIZE
    },
    fileFilter: documentFilter
}).single('document');

/**
 * Mixed file upload middleware
 * Allows both images and documents
 */
const uploadMixed = multer({
    storage: memoryStorage,
    limits: {
        fileSize: MAX_DOCUMENT_SIZE
    },
    fileFilter: mixedFilter
}).fields([
    { name: 'image', maxCount: 1 },
    { name: 'images', maxCount: 10 },
    { name: 'document', maxCount: 1 }
]);

/**
 * Handle multer errors
 */
const handleUploadError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File is too large. Maximum size is 5MB for images, 10MB for documents.'
            });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                success: false,
                message: 'Too many files. Maximum is 10 files.'
            });
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({
                success: false,
                message: 'Unexpected field name for file upload.'
            });
        }
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }

    if (err) {
        return res.status(400).json({
            success: false,
            message: err.message || 'File upload error'
        });
    }

    next();
};

/**
 * Wrapper to handle multer middleware with error handling
 */
const upload = (middleware) => {
    return (req, res, next) => {
        middleware(req, res, (err) => {
            if (err) {
                return handleUploadError(err, req, res, next);
            }
            next();
        });
    };
};

module.exports = {
    uploadSingleImage: upload(uploadSingleImage),
    uploadMultipleImages: (maxCount) => upload(uploadMultipleImages(maxCount)),
    uploadSingleDocument: upload(uploadSingleDocument),
    uploadMixed: upload(uploadMixed),
    handleUploadError,
    ALLOWED_IMAGE_TYPES,
    ALLOWED_DOCUMENT_TYPES,
    MAX_IMAGE_SIZE,
    MAX_DOCUMENT_SIZE
};
