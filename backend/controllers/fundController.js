/**
 * Fund Controller
 * Handles Fund submission and retrieval
 */

const { SHEETS, create, getAll } = require('../utils/sheetHelper');
const { generateId } = require('../utils/generateId');
const {
    successResponse,
    errorResponse,
    createdResponse
} = require('../utils/response');

/**
 * Submit a new fund contribution request
 * POST /api/fund
 */
const submitFund = async (req, res) => {
    try {
        const { name, email, phone, amount, message } = req.body;

        const fundData = {
            id: generateId('fund'),
            name,
            email,
            phone,
            amount,
            message,
            status: 'pending', // pending, approved, rejected
            created_at: new Date().toISOString()
        };

        const newFund = await create(SHEETS.FUNDS, fundData);

        // Here you could trigger email notification to admin

        return createdResponse(res, newFund, 'Fund request submitted successfully');
    } catch (error) {
        console.error('Submit Fund error:', error.message);
        return errorResponse(res, 'Failed to submit fund request', 500);
    }
};

/**
 * Get all fund requests (Admin only)
 * GET /api/fund
 */
const getAllFunds = async (req, res) => {
    try {
        const { page = 1, limit = 50 } = req.query;

        const result = await getAll(SHEETS.FUNDS, {
            page: parseInt(page),
            limit: parseInt(limit),
            sortBy: 'created_at',
            sortOrder: 'desc'
        });

        return successResponse(res, result, 'Fund requests retrieved successfully');
    } catch (error) {
        console.error('Get all funds error:', error.message);
        return errorResponse(res, 'Failed to retrieve fund requests', 500);
    }
};

module.exports = {
    submitFund,
    getAllFunds
};
