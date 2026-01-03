/**
 * Slugify Utility
 * Generate URL-safe slugs from strings
 */

/**
 * Generate a URL-safe slug from a string
 * @param {string} text - Text to convert to slug
 * @param {Object} options - Slugify options
 * @returns {string} URL-safe slug
 */
function slugify(text, options = {}) {
    const {
        separator = '-',
        lowercase = true,
        maxLength = 100,
        removeNumbers = false
    } = options;

    if (!text || typeof text !== 'string') {
        return '';
    }

    let slug = text
        // Convert to string and trim
        .toString()
        .trim()
        // Remove accents/diacritics
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        // Replace spaces and underscores with separator
        .replace(/[\s_]+/g, separator)
        // Remove all non-alphanumeric characters except separator
        .replace(new RegExp(`[^a-zA-Z0-9${separator}]`, 'g'), '')
        // Replace multiple separators with single one
        .replace(new RegExp(`${separator}+`, 'g'), separator)
        // Remove leading/trailing separators
        .replace(new RegExp(`^${separator}|${separator}$`, 'g'), '');

    // Convert to lowercase if option is set
    if (lowercase) {
        slug = slug.toLowerCase();
    }

    // Remove numbers if option is set
    if (removeNumbers) {
        slug = slug.replace(/[0-9]/g, '');
    }

    // Truncate to max length
    if (slug.length > maxLength) {
        slug = slug.substring(0, maxLength);
        // Remove trailing separator if present after truncation
        slug = slug.replace(new RegExp(`${separator}$`), '');
    }

    return slug;
}

/**
 * Generate a unique slug by appending a number if slug already exists
 * @param {string} text - Text to convert to slug
 * @param {Function} checkExists - Async function to check if slug exists
 * @returns {Promise<string>} Unique slug
 */
async function uniqueSlug(text, checkExists) {
    let slug = slugify(text);
    let uniqueSlug = slug;
    let counter = 1;

    while (await checkExists(uniqueSlug)) {
        uniqueSlug = `${slug}-${counter}`;
        counter++;

        // Safety limit
        if (counter > 100) {
            uniqueSlug = `${slug}-${Date.now()}`;
            break;
        }
    }

    return uniqueSlug;
}

/**
 * Convert slug back to readable text
 * @param {string} slug - Slug to convert
 * @returns {string} Readable text
 */
function unslugify(slug) {
    if (!slug || typeof slug !== 'string') {
        return '';
    }

    return slug
        .replace(/-/g, ' ')
        .replace(/\b\w/g, char => char.toUpperCase());
}

/**
 * Validate slug format
 * @param {string} slug - Slug to validate
 * @returns {boolean} True if valid
 */
function isValidSlug(slug) {
    if (!slug || typeof slug !== 'string') {
        return false;
    }

    // Valid slug: lowercase letters, numbers, and hyphens
    // Cannot start or end with hyphen
    // Cannot have consecutive hyphens
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    return slugRegex.test(slug);
}

module.exports = {
    slugify,
    uniqueSlug,
    unslugify,
    isValidSlug
};
