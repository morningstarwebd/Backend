/**
 * Google Sheets Helper
 * Enhanced CRUD operations and utility functions for Google Sheets
 */

const {
    SHEETS,
    SHEET_HEADERS,
    getSheetData,
    appendRow,
    updateRow,
    deleteRow,
    findById,
    findByField
} = require('../config/googleSheets');
const { generateId } = require('./generateId');

/**
 * Get all rows from a sheet with optional filtering and pagination
 * @param {string} sheetName - Sheet name
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Data with pagination info
 */
async function getAll(sheetName, options = {}) {
    const {
        page = 1,
        limit = 10,
        sortBy = 'created_at',
        sortOrder = 'desc',
        filters = {}
    } = options;

    try {
        let data = await getSheetData(sheetName);

        // Apply filters
        if (Object.keys(filters).length > 0) {
            data = data.filter(row => {
                return Object.entries(filters).every(([key, value]) => {
                    if (value === undefined || value === null || value === '') return true;
                    return String(row[key]).toLowerCase().includes(String(value).toLowerCase());
                });
            });
        }

        // Sort data
        data.sort((a, b) => {
            const aVal = a[sortBy] || '';
            const bVal = b[sortBy] || '';

            if (sortOrder === 'desc') {
                return bVal.localeCompare(aVal);
            }
            return aVal.localeCompare(bVal);
        });

        // Calculate pagination
        const total = data.length;
        const totalPages = Math.ceil(total / limit);
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        // Paginate
        const paginatedData = data.slice(startIndex, endIndex);

        return {
            data: paginatedData,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        };
    } catch (error) {
        console.error(`Error in getAll for ${sheetName}:`, error.message);
        throw error;
    }
}

/**
 * Get a single row by ID
 * @param {string} sheetName - Sheet name
 * @param {string} id - Row ID
 * @returns {Promise<Object|null>} Found row or null
 */
async function getById(sheetName, id) {
    try {
        const result = await findById(sheetName, id);
        return result ? result.data : null;
    } catch (error) {
        console.error(`Error in getById for ${sheetName}:`, error.message);
        throw error;
    }
}

/**
 * Get rows by a specific field value
 * @param {string} sheetName - Sheet name
 * @param {string} field - Field name
 * @param {string} value - Field value
 * @returns {Promise<Array>} Matching rows
 */
async function getByField(sheetName, field, value) {
    try {
        return await findByField(sheetName, field, value);
    } catch (error) {
        console.error(`Error in getByField for ${sheetName}:`, error.message);
        throw error;
    }
}

/**
 * Create a new row
 * @param {string} sheetName - Sheet name
 * @param {Object} data - Row data
 * @returns {Promise<Object>} Created row
 */
async function create(sheetName, data) {
    try {
        const now = new Date().toISOString();
        const newData = {
            ...data,
            id: data.id || generateId(),
            created_at: now,
            updated_at: now
        };

        await appendRow(sheetName, newData);
        return newData;
    } catch (error) {
        console.error(`Error in create for ${sheetName}:`, error.message);
        throw error;
    }
}

/**
 * Update an existing row by ID
 * @param {string} sheetName - Sheet name
 * @param {string} id - Row ID
 * @param {Object} updates - Updated data
 * @returns {Promise<Object|null>} Updated row or null if not found
 */
async function update(sheetName, id, updates) {
    try {
        const result = await findById(sheetName, id);

        if (!result) {
            return null;
        }

        const updatedData = {
            ...result.data,
            ...updates,
            id: result.data.id, // Preserve original ID
            created_at: result.data.created_at, // Preserve created_at
            updated_at: new Date().toISOString()
        };

        await updateRow(sheetName, result.rowIndex, updatedData);
        return updatedData;
    } catch (error) {
        console.error(`Error in update for ${sheetName}:`, error.message);
        throw error;
    }
}

/**
 * Delete a row by ID
 * @param {string} sheetName - Sheet name
 * @param {string} id - Row ID
 * @returns {Promise<boolean>} True if deleted, false if not found
 */
async function remove(sheetName, id) {
    try {
        const result = await findById(sheetName, id);

        if (!result) {
            return false;
        }

        await deleteRow(sheetName, result.rowIndex);
        return true;
    } catch (error) {
        console.error(`Error in remove for ${sheetName}:`, error.message);
        throw error;
    }
}

/**
 * Check if a value exists in a specific field
 * @param {string} sheetName - Sheet name
 * @param {string} field - Field name
 * @param {string} value - Value to check
 * @param {string} excludeId - ID to exclude from check
 * @returns {Promise<boolean>} True if exists
 */
async function exists(sheetName, field, value, excludeId = null) {
    try {
        const data = await getSheetData(sheetName);
        return data.some(row => {
            if (excludeId && row.id === excludeId) return false;
            return row[field] === value;
        });
    } catch (error) {
        console.error(`Error in exists for ${sheetName}:`, error.message);
        throw error;
    }
}

/**
 * Count total rows in a sheet
 * @param {string} sheetName - Sheet name
 * @param {Object} filters - Optional filters
 * @returns {Promise<number>} Row count
 */
async function count(sheetName, filters = {}) {
    try {
        let data = await getSheetData(sheetName);

        if (Object.keys(filters).length > 0) {
            data = data.filter(row => {
                return Object.entries(filters).every(([key, value]) => {
                    if (value === undefined || value === null || value === '') return true;
                    return row[key] === value;
                });
            });
        }

        return data.length;
    } catch (error) {
        console.error(`Error in count for ${sheetName}:`, error.message);
        throw error;
    }
}

/**
 * Get distinct values for a field
 * @param {string} sheetName - Sheet name
 * @param {string} field - Field name
 * @returns {Promise<Array>} Distinct values
 */
async function distinct(sheetName, field) {
    try {
        const data = await getSheetData(sheetName);
        const values = data.map(row => row[field]).filter(Boolean);
        return [...new Set(values)];
    } catch (error) {
        console.error(`Error in distinct for ${sheetName}:`, error.message);
        throw error;
    }
}

/**
 * Bulk update multiple rows
 * @param {string} sheetName - Sheet name
 * @param {Array} updates - Array of {id, data} objects
 * @returns {Promise<Array>} Updated rows
 */
async function bulkUpdate(sheetName, updates) {
    try {
        const results = [];
        for (const { id, data } of updates) {
            const updated = await update(sheetName, id, data);
            if (updated) results.push(updated);
        }
        return results;
    } catch (error) {
        console.error(`Error in bulkUpdate for ${sheetName}:`, error.message);
        throw error;
    }
}

/**
 * Search across multiple fields
 * @param {string} sheetName - Sheet name
 * @param {string} query - Search query
 * @param {Array} fields - Fields to search in
 * @returns {Promise<Array>} Matching rows
 */
async function search(sheetName, query, fields) {
    try {
        const data = await getSheetData(sheetName);
        const lowerQuery = query.toLowerCase();

        return data.filter(row => {
            return fields.some(field => {
                const value = row[field];
                return value && String(value).toLowerCase().includes(lowerQuery);
            });
        });
    } catch (error) {
        console.error(`Error in search for ${sheetName}:`, error.message);
        throw error;
    }
}

module.exports = {
    SHEETS,
    SHEET_HEADERS,
    getAll,
    getById,
    getByField,
    create,
    update,
    remove,
    exists,
    count,
    distinct,
    bulkUpdate,
    search
};
