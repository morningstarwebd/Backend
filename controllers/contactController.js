/**
 * Contact Controller
 * Handles contact form submissions and message management
 */

const { SHEETS, getAll, getById, create, update, remove } = require('../utils/sheetHelper');
const { generateId } = require('../utils/generateId');
const {
    successResponse,
    errorResponse,
    createdResponse,
    notFoundResponse,
    paginatedResponse
} = require('../utils/response');

/**
 * Submit contact form (public)
 * POST /api/contact
 */
const submitContactForm = async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;

        const messageData = {
            id: generateId('con'),
            name,
            email,
            phone: phone || '',
            subject: subject || 'No Subject',
            message,
            status: 'unread'
        };

        const newMessage = await create(SHEETS.CONTACT_MESSAGES, messageData);
        return createdResponse(res, {
            id: newMessage.id,
            message: 'Thank you for your message. We will get back to you soon.'
        }, 'Message sent successfully');
    } catch (error) {
        console.error('Submit contact form error:', error.message);
        return errorResponse(res, 'Failed to send message', 500);
    }
};

/**
 * Get all contact messages (protected)
 * GET /api/contact
 */
const getAllMessages = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, search } = req.query;

        const filters = {};
        if (status) filters.status = status;

        const result = await getAll(SHEETS.CONTACT_MESSAGES, {
            page: parseInt(page),
            limit: parseInt(limit),
            sortBy: 'created_at',
            sortOrder: 'desc',
            filters
        });

        // Filter by search
        let data = result.data;
        if (search) {
            const searchLower = search.toLowerCase();
            data = data.filter(msg =>
                msg.name?.toLowerCase().includes(searchLower) ||
                msg.email?.toLowerCase().includes(searchLower) ||
                msg.subject?.toLowerCase().includes(searchLower) ||
                msg.message?.toLowerCase().includes(searchLower)
            );
        }

        // Add stats
        const allMessages = await getAll(SHEETS.CONTACT_MESSAGES, {
            page: 1,
            limit: 1000
        });

        const stats = {
            total: allMessages.data.length,
            unread: allMessages.data.filter(m => m.status === 'unread').length,
            read: allMessages.data.filter(m => m.status === 'read').length,
            replied: allMessages.data.filter(m => m.status === 'replied').length
        };

        return res.status(200).json({
            success: true,
            message: 'Messages retrieved successfully',
            data,
            pagination: result.pagination,
            stats
        });
    } catch (error) {
        console.error('Get all messages error:', error.message);
        return errorResponse(res, 'Failed to retrieve messages', 500);
    }
};

/**
 * Get single message (protected)
 * GET /api/contact/:id
 */
const getMessageById = async (req, res) => {
    try {
        const { id } = req.params;
        const message = await getById(SHEETS.CONTACT_MESSAGES, id);

        if (!message) {
            return notFoundResponse(res, 'Message');
        }

        // Mark as read if unread
        if (message.status === 'unread') {
            await update(SHEETS.CONTACT_MESSAGES, id, { status: 'read' });
            message.status = 'read';
        }

        return successResponse(res, message, 'Message retrieved successfully');
    } catch (error) {
        console.error('Get message by ID error:', error.message);
        return errorResponse(res, 'Failed to retrieve message', 500);
    }
};

/**
 * Update message status (protected)
 * PUT /api/contact/:id/status
 */
const updateMessageStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['unread', 'read', 'replied', 'archived'].includes(status)) {
            return errorResponse(res, 'Invalid status. Must be unread, read, replied, or archived', 400);
        }

        const existing = await getById(SHEETS.CONTACT_MESSAGES, id);
        if (!existing) {
            return notFoundResponse(res, 'Message');
        }

        const updatedMessage = await update(SHEETS.CONTACT_MESSAGES, id, { status });
        return successResponse(res, updatedMessage, 'Message status updated successfully');
    } catch (error) {
        console.error('Update message status error:', error.message);
        return errorResponse(res, 'Failed to update message status', 500);
    }
};

/**
 * Delete message (protected)
 * DELETE /api/contact/:id
 */
const deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;

        const existing = await getById(SHEETS.CONTACT_MESSAGES, id);
        if (!existing) {
            return notFoundResponse(res, 'Message');
        }

        await remove(SHEETS.CONTACT_MESSAGES, id);
        return successResponse(res, null, 'Message deleted successfully');
    } catch (error) {
        console.error('Delete message error:', error.message);
        return errorResponse(res, 'Failed to delete message', 500);
    }
};

/**
 * Bulk delete messages (protected)
 * DELETE /api/contact
 */
const bulkDeleteMessages = async (req, res) => {
    try {
        const { ids } = req.body;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return errorResponse(res, 'Message IDs array is required', 400);
        }

        let deletedCount = 0;

        for (const id of ids) {
            try {
                const existing = await getById(SHEETS.CONTACT_MESSAGES, id);
                if (existing) {
                    await remove(SHEETS.CONTACT_MESSAGES, id);
                    deletedCount++;
                }
            } catch (err) {
                console.error(`Failed to delete message ${id}:`, err.message);
            }
        }

        return successResponse(res, {
            deleted: deletedCount,
            total: ids.length
        }, `${deletedCount} of ${ids.length} messages deleted successfully`);
    } catch (error) {
        console.error('Bulk delete messages error:', error.message);
        return errorResponse(res, 'Failed to delete messages', 500);
    }
};

/**
 * Bulk update message status (protected)
 * PUT /api/contact/bulk-status
 */
const bulkUpdateStatus = async (req, res) => {
    try {
        const { ids, status } = req.body;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return errorResponse(res, 'Message IDs array is required', 400);
        }

        if (!['unread', 'read', 'replied', 'archived'].includes(status)) {
            return errorResponse(res, 'Invalid status', 400);
        }

        let updatedCount = 0;

        for (const id of ids) {
            try {
                const existing = await getById(SHEETS.CONTACT_MESSAGES, id);
                if (existing) {
                    await update(SHEETS.CONTACT_MESSAGES, id, { status });
                    updatedCount++;
                }
            } catch (err) {
                console.error(`Failed to update message ${id}:`, err.message);
            }
        }

        return successResponse(res, {
            updated: updatedCount,
            total: ids.length
        }, `${updatedCount} of ${ids.length} messages updated successfully`);
    } catch (error) {
        console.error('Bulk update status error:', error.message);
        return errorResponse(res, 'Failed to update messages', 500);
    }
};

module.exports = {
    submitContactForm,
    getAllMessages,
    getMessageById,
    updateMessageStatus,
    deleteMessage,
    bulkDeleteMessages,
    bulkUpdateStatus
};
