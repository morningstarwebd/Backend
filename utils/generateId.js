/**
 * ID Generator Utility
 * Generate unique IDs for database records
 */

const crypto = require('crypto');

/**
 * Generate a unique ID
 * Format: prefix_timestamp_random
 * @param {string} prefix - Optional prefix for the ID
 * @returns {string} Unique ID
 */
function generateId(prefix = '') {
    const timestamp = Date.now().toString(36);
    const randomPart = crypto.randomBytes(4).toString('hex');

    if (prefix) {
        return `${prefix}_${timestamp}${randomPart}`;
    }

    return `${timestamp}${randomPart}`;
}

/**
 * Generate a UUID v4
 * @returns {string} UUID v4
 */
function generateUUID() {
    return crypto.randomUUID();
}

/**
 * Generate a short ID (8 characters)
 * @returns {string} Short ID
 */
function generateShortId() {
    return crypto.randomBytes(4).toString('hex');
}

/**
 * Generate a numeric ID
 * @param {number} length - Length of the ID (default: 10)
 * @returns {string} Numeric ID
 */
function generateNumericId(length = 10) {
    let id = '';
    for (let i = 0; i < length; i++) {
        id += Math.floor(Math.random() * 10).toString();
    }
    return id;
}

/**
 * Generate an alphanumeric ID
 * @param {number} length - Length of the ID (default: 12)
 * @returns {string} Alphanumeric ID
 */
function generateAlphanumericId(length = 12) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let id = '';
    for (let i = 0; i < length; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
}

/**
 * Generate a prefixed ID for specific entity types
 * @param {string} entityType - Type of entity
 * @returns {string} Prefixed ID
 */
function generateEntityId(entityType) {
    const prefixes = {
        user: 'usr',
        post: 'pst',
        product: 'prd',
        category: 'cat',
        content: 'cnt',
        menu: 'mnu',
        setting: 'set',
        testimonial: 'tst',
        faq: 'faq',
        image: 'img',
        contact: 'con'
    };

    const prefix = prefixes[entityType] || 'itm';
    return generateId(prefix);
}

module.exports = {
    generateId,
    generateUUID,
    generateShortId,
    generateNumericId,
    generateAlphanumericId,
    generateEntityId
};
