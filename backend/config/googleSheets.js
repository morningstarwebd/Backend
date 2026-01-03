/**
 * Google Sheets Configuration
 * Handles authentication and provides access to Google Sheets API
 */

const { google } = require('googleapis');
const path = require('path');

// Sheet names configuration
const SHEETS = {
    WEBSITE_CONTENT: 'website_content',
    BLOG_POSTS: 'blog_posts',
    PRODUCTS: 'products',
    CATEGORIES: 'categories',
    SETTINGS: 'settings',
    MENU_ITEMS: 'menu_items',
    ADMIN_USERS: 'admin_users',
    TESTIMONIALS: 'testimonials',
    FAQS: 'faqs',
    IMAGES: 'images',
    CONTACT_MESSAGES: 'contact_messages'
};

// Column headers for each sheet
const SHEET_HEADERS = {
    [SHEETS.WEBSITE_CONTENT]: ['id', 'page', 'section', 'content', 'image_url', 'order', 'created_at', 'updated_at'],
    [SHEETS.BLOG_POSTS]: ['id', 'title', 'slug', 'content', 'excerpt', 'category', 'author', 'date', 'image_url', 'status', 'views', 'created_at', 'updated_at'],
    [SHEETS.PRODUCTS]: ['id', 'name', 'slug', 'price', 'description', 'image_url', 'gallery_urls', 'category', 'stock', 'sku', 'status', 'created_at', 'updated_at'],
    [SHEETS.CATEGORIES]: ['id', 'name', 'slug', 'type', 'description', 'order', 'status'],
    [SHEETS.SETTINGS]: ['id', 'setting_key', 'setting_value', 'setting_type', 'updated_at'],
    [SHEETS.MENU_ITEMS]: ['id', 'label', 'url', 'parent_id', 'order', 'target', 'status'],
    [SHEETS.ADMIN_USERS]: ['id', 'username', 'email', 'password_hash', 'role', 'status', 'last_login', 'created_at'],
    [SHEETS.TESTIMONIALS]: ['id', 'name', 'designation', 'review', 'rating', 'image_url', 'status', 'order', 'created_at'],
    [SHEETS.FAQS]: ['id', 'question', 'answer', 'category', 'order', 'status', 'created_at'],
    [SHEETS.IMAGES]: ['id', 'filename', 'url', 'cloudinary_id', 'size', 'width', 'height', 'format', 'upload_date'],
    [SHEETS.CONTACT_MESSAGES]: ['id', 'name', 'email', 'phone', 'subject', 'message', 'status', 'created_at']
};

/**
 * Initialize Google Sheets API client
 * @returns {Promise<Object>} Google Sheets API instance
 */
let cachedSheetsClient = null;

async function getGoogleSheetsClient() {
    if (cachedSheetsClient) return cachedSheetsClient;

    try {
        // Try keyFile first (recommended), then fall back to env credentials
        const keyFilePath = path.join(__dirname, 'google-credentials.json');

        let auth;
        const fs = require('fs');

        // Check if credentials file exists
        if (fs.existsSync(keyFilePath)) {
            auth = new google.auth.GoogleAuth({
                keyFile: keyFilePath,
                scopes: ['https://www.googleapis.com/auth/spreadsheets']
            });
        } else {
            // Fallback to environment variables
            let privateKey = process.env.GOOGLE_PRIVATE_KEY;
            if (privateKey) {
                // If the key is wrapped in quotes, remove them
                if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
                    privateKey = privateKey.slice(1, -1);
                }
                // Replace literal \n with actual newlines
                privateKey = privateKey.replace(/\\n/g, '\n');
            }

            auth = new google.auth.GoogleAuth({
                credentials: {
                    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
                    private_key: privateKey
                },
                scopes: ['https://www.googleapis.com/auth/spreadsheets']
            });
        }

        const authClient = await auth.getClient();
        cachedSheetsClient = google.sheets({ version: 'v4', auth: authClient });

        return cachedSheetsClient;
    } catch (error) {
        console.error('Error initializing Google Sheets client:', error.message);
        // Throw actual error for debugging
        throw new Error(`Failed to initialize Google Sheets API: ${error.message}`);
    }
}

/**
 * Get the spreadsheet ID from environment
 * @returns {string} Spreadsheet ID
 */
function getSpreadsheetId() {
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    if (!spreadsheetId) {
        throw new Error('GOOGLE_SHEET_ID is not configured');
    }
    return spreadsheetId;
}

// Simple in-memory cache
const sheetCache = {};
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Get all data from a sheet
 * @param {string} sheetName - Name of the sheet
 * @returns {Promise<Array>} Array of row objects
 */
async function getSheetData(sheetName) {
    // Check cache
    const cached = sheetCache[sheetName];
    if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
        return cached.data;
    }

    try {
        const sheets = await getGoogleSheetsClient();
        const spreadsheetId = getSpreadsheetId();
        const headers = SHEET_HEADERS[sheetName];

        if (!headers) {
            throw new Error(`Unknown sheet: ${sheetName}`);
        }

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: `${sheetName}!A2:Z`, // Assuming headers are in row 1
        });

        const rows = response.data.values;

        if (!rows || rows.length === 0) {
            return [];
        }

        // Map rows to objects based on headers
        const data = rows.map((row, index) => {
            const rowData = {};
            headers.forEach((header, i) => {
                rowData[header] = row[i] || ''; // Handle missing values
            });
            // Add internal row index (0-based index of the data array => row index in sheet is index + 2)
            // But for findById we need rowIndex relative to sheet (1-based)
            // Header is row 1. Data starts at row 2.
            // So data[0] is at row 2.
            rowData._rowIndex = index + 2;
            return rowData;
        });

        // Update cache
        sheetCache[sheetName] = {
            data,
            timestamp: Date.now()
        };

        return data;
    } catch (error) {
        console.error(`Error getting data from sheet ${sheetName}:`, error.message);
        throw error;
    }
}

/**
 * Append a new row to a sheet
 * @param {string} sheetName - Name of the sheet
 * @param {Object} data - Row data object
 * @returns {Promise<Object>} Append result
 */
async function appendRow(sheetName, data) {
    try {
        const sheets = await getGoogleSheetsClient();
        const spreadsheetId = getSpreadsheetId();
        const headers = SHEET_HEADERS[sheetName];

        if (!headers) {
            throw new Error(`Unknown sheet: ${sheetName}`);
        }

        // Convert object to array based on headers order
        const rowValues = headers.map(header => data[header] || '');

        const response = await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: `${sheetName}!A:Z`,
            valueInputOption: 'RAW',
            insertDataOption: 'INSERT_ROWS',
            resource: {
                values: [rowValues]
            }
        });

        return response.data;
    } catch (error) {
        console.error(`Error appending row to sheet ${sheetName}:`, error.message);
        throw error;
    }
}

/**
 * Update a row in a sheet by row index
 * @param {string} sheetName - Name of the sheet
 * @param {number} rowIndex - Row index (1-based, excluding header)
 * @param {Object} data - Updated row data
 * @returns {Promise<Object>} Update result
 */
async function updateRow(sheetName, rowIndex, data) {
    try {
        const sheets = await getGoogleSheetsClient();
        const spreadsheetId = getSpreadsheetId();
        const headers = SHEET_HEADERS[sheetName];

        if (!headers) {
            throw new Error(`Unknown sheet: ${sheetName}`);
        }

        // Row index is already 1-based (from findById or manual calculation)
        const sheetRowIndex = rowIndex;

        // Convert object to array based on headers order
        const rowValues = headers.map(header => data[header] || '');

        const response = await sheets.spreadsheets.values.update({
            spreadsheetId,
            range: `${sheetName}!A${sheetRowIndex}:Z${sheetRowIndex}`,
            valueInputOption: 'RAW',
            resource: {
                values: [rowValues]
            }
        });

        return response.data;
    } catch (error) {
        console.error(`Error updating row in sheet ${sheetName}:`, error.message);
        throw error;
    }
}

/**
 * Delete a row from a sheet by row index
 * @param {string} sheetName - Name of the sheet
 * @param {number} rowIndex - Row index to delete (1-based, excluding header)
 * @returns {Promise<Object>} Delete result
 */
async function deleteRow(sheetName, rowIndex) {
    try {
        const sheets = await getGoogleSheetsClient();
        const spreadsheetId = getSpreadsheetId();

        // First, get the sheet ID
        const spreadsheet = await sheets.spreadsheets.get({
            spreadsheetId
        });

        const sheet = spreadsheet.data.sheets.find(
            s => s.properties.title === sheetName
        );

        if (!sheet) {
            throw new Error(`Sheet ${sheetName} not found`);
        }

        const sheetId = sheet.properties.sheetId;

        // Row index in sheets (add 1 for header)
        const sheetRowIndex = rowIndex;

        const response = await sheets.spreadsheets.batchUpdate({
            spreadsheetId,
            resource: {
                requests: [{
                    deleteDimension: {
                        range: {
                            sheetId,
                            dimension: 'ROWS',
                            startIndex: sheetRowIndex,
                            endIndex: sheetRowIndex + 1
                        }
                    }
                }]
            }
        });

        return response.data;
    } catch (error) {
        console.error(`Error deleting row from sheet ${sheetName}:`, error.message);
        throw error;
    }
}

/**
 * Find a row by ID
 * @param {string} sheetName - Name of the sheet
 * @param {string} id - ID to find
 * @returns {Promise<Object|null>} Found row object with index, or null
 */
async function findById(sheetName, id) {
    try {
        const data = await getSheetData(sheetName);
        const index = data.findIndex(row => row.id === id);

        if (index === -1) return null;

        return {
            data: data[index],
            rowIndex: index + 2 // +1 for header, +1 for 1-based index
        };
    } catch (error) {
        console.error(`Error finding by ID in sheet ${sheetName}:`, error.message);
        throw error;
    }
}

/**
 * Find rows by a specific field value
 * @param {string} sheetName - Name of the sheet
 * @param {string} field - Field name to search
 * @param {string} value - Value to match
 * @returns {Promise<Array>} Array of matching row objects
 */
async function findByField(sheetName, field, value) {
    try {
        const data = await getSheetData(sheetName);
        return data.filter(row => row[field] === value);
    } catch (error) {
        console.error(`Error finding by field in sheet ${sheetName}:`, error.message);
        throw error;
    }
}

/**
 * Initialize sheet with headers if empty
 * @param {string} sheetName - Name of the sheet
 * @returns {Promise<void>}
 */
async function initializeSheet(sheetName) {
    try {
        const sheets = await getGoogleSheetsClient();
        const spreadsheetId = getSpreadsheetId();
        const headers = SHEET_HEADERS[sheetName];

        if (!headers) {
            throw new Error(`Unknown sheet: ${sheetName}`);
        }

        // Check if sheet has data
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: `${sheetName}!A1:Z1`
        });

        // If no data, add headers
        if (!response.data.values || response.data.values.length === 0) {
            await sheets.spreadsheets.values.update({
                spreadsheetId,
                range: `${sheetName}!A1:Z1`,
                valueInputOption: 'RAW',
                resource: {
                    values: [headers]
                }
            });
            console.log(`Initialized sheet ${sheetName} with headers`);
        }
    } catch (error) {
        console.error(`Error initializing sheet ${sheetName}:`, error.message);
        throw error;
    }
}

module.exports = {
    SHEETS,
    SHEET_HEADERS,
    getGoogleSheetsClient,
    getSpreadsheetId,
    getSheetData,
    appendRow,
    updateRow,
    deleteRow,
    findById,
    findByField,
    initializeSheet
};
