/**
 * Content Controller
 * Handles website content CRUD operations
 */

const { SHEETS, getAll, getById, getByField, create, update, remove } = require('../utils/sheetHelper');
const { generateId } = require('../utils/generateId');
const {
    successResponse,
    errorResponse,
    createdResponse,
    notFoundResponse,
    paginatedResponse
} = require('../utils/response');

/**
 * Get all content
 * GET /api/content
 */
const getAllContent = async (req, res) => {
    try {
        const { page = 1, limit = 10, page: filterPage, section } = req.query;

        const result = await getAll(SHEETS.WEBSITE_CONTENT, {
            page: parseInt(page),
            limit: parseInt(limit),
            sortBy: 'order',
            sortOrder: 'asc',
            filters: { page: filterPage, section }
        });

        return paginatedResponse(res, result.data, result.pagination, 'Content retrieved successfully');
    } catch (error) {
        console.error('Get all content error:', error.message);
        return errorResponse(res, 'Failed to retrieve content', 500);
    }
};

/**
 * Get content by ID
 * GET /api/content/:id
 */
const getContentById = async (req, res) => {
    try {
        const { id } = req.params;
        const content = await getById(SHEETS.WEBSITE_CONTENT, id);

        if (!content) {
            return notFoundResponse(res, 'Content');
        }

        return successResponse(res, content, 'Content retrieved successfully');
    } catch (error) {
        console.error('Get content by ID error:', error.message);
        return errorResponse(res, 'Failed to retrieve content', 500);
    }
};

/**
 * Get content by page
 * GET /api/content/page/:page
 */
const getContentByPage = async (req, res) => {
    try {
        const { page } = req.params;
        const content = await getByField(SHEETS.WEBSITE_CONTENT, 'page', page);

        // Sort by order
        content.sort((a, b) => (parseInt(a.order) || 0) - (parseInt(b.order) || 0));

        return successResponse(res, content, 'Content retrieved successfully');
    } catch (error) {
        console.error('Get content by page error:', error.message);
        return errorResponse(res, 'Failed to retrieve content', 500);
    }
};

/**
 * Create new content
 * POST /api/content
 */
const createContent = async (req, res) => {
    try {
        const { page, section, content, image_url, order = 0 } = req.body;

        const contentData = {
            id: generateId('cnt'),
            page,
            section,
            content: content || '',
            image_url: image_url || '',
            order: parseInt(order) || 0
        };

        const newContent = await create(SHEETS.WEBSITE_CONTENT, contentData);
        return createdResponse(res, newContent, 'Content created successfully');
    } catch (error) {
        console.error('Create content error:', error.message);
        return errorResponse(res, 'Failed to create content', 500);
    }
};

/**
 * Update content
 * PUT /api/content/:id
 */
const updateContent = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const existing = await getById(SHEETS.WEBSITE_CONTENT, id);
        if (!existing) {
            return notFoundResponse(res, 'Content');
        }

        // Clean up order if provided
        if (updates.order !== undefined) {
            updates.order = parseInt(updates.order) || 0;
        }

        const updatedContent = await update(SHEETS.WEBSITE_CONTENT, id, updates);
        return successResponse(res, updatedContent, 'Content updated successfully');
    } catch (error) {
        console.error('Update content error:', error.message);
        return errorResponse(res, 'Failed to update content', 500);
    }
};

/**
 * Delete content
 * DELETE /api/content/:id
 */
const deleteContent = async (req, res) => {
    try {
        const { id } = req.params;

        const existing = await getById(SHEETS.WEBSITE_CONTENT, id);
        if (!existing) {
            return notFoundResponse(res, 'Content');
        }

        await remove(SHEETS.WEBSITE_CONTENT, id);
        return successResponse(res, null, 'Content deleted successfully');
    } catch (error) {
        console.error('Delete content error:', error.message);
        return errorResponse(res, 'Failed to delete content', 500);
    }
};

module.exports = {
    getAllContent,
    getContentById,
    getContentByPage,
    createContent,
    updateContent,
    deleteContent
};
