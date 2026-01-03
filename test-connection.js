// Test Google Sheets Connection using credentials file
require('dotenv').config();
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

async function testConnection() {
    console.log('=== Testing Google Sheets Connection ===\n');

    const keyFilePath = path.join(__dirname, 'config', 'google-credentials.json');

    console.log('1. Checking credentials file...');
    console.log('   Path:', keyFilePath);
    console.log('   File exists:', fs.existsSync(keyFilePath) ? 'Yes ✓' : 'No ✗');

    if (!fs.existsSync(keyFilePath)) {
        console.log('\n❌ Credentials file not found!');
        console.log('   Please create: config/google-credentials.json');
        return;
    }

    // Read and parse credentials
    console.log('\n2. Reading credentials file...');
    try {
        const credentials = JSON.parse(fs.readFileSync(keyFilePath, 'utf8'));
        console.log('   client_email:', credentials.client_email ? 'Found ✓' : 'Missing ✗');
        console.log('   private_key:', credentials.private_key ? 'Found ✓' : 'Missing ✗');

        if (credentials.private_key) {
            console.log('   Key starts with BEGIN:', credentials.private_key.includes('-----BEGIN PRIVATE KEY-----') ? 'Yes ✓' : 'No ✗');
            console.log('   Key length:', credentials.private_key.length, 'chars');
        }
    } catch (parseError) {
        console.log('   ❌ Failed to parse JSON:', parseError.message);
        return;
    }

    // Try to connect
    console.log('\n3. Attempting connection...');
    try {
        const auth = new google.auth.GoogleAuth({
            keyFile: keyFilePath,
            scopes: ['https://www.googleapis.com/auth/spreadsheets']
        });

        const authClient = await auth.getClient();
        console.log('   Auth client created ✓');

        const sheets = google.sheets({ version: 'v4', auth: authClient });
        console.log('   Sheets API initialized ✓');

        // Try to read the spreadsheet
        console.log('\n4. Testing spreadsheet access...');
        const spreadsheetId = process.env.GOOGLE_SHEET_ID;
        console.log('   Spreadsheet ID:', spreadsheetId);

        const spreadsheet = await sheets.spreadsheets.get({
            spreadsheetId
        });

        console.log('   Spreadsheet title:', spreadsheet.data.properties.title);
        console.log('   Sheets found:', spreadsheet.data.sheets.map(s => s.properties.title).join(', '));

        console.log('\n✅ Connection successful!');
    } catch (error) {
        console.log('\n❌ Connection failed!');
        console.log('   Error:', error.message);

        if (error.message.includes('DECODER') || error.message.includes('unsupported')) {
            console.log('\n   → Private key format issue in JSON file.');
            console.log('   → Make sure the private_key in JSON has actual \\n (newlines).');
        }
        if (error.message.includes('not found')) {
            console.log('\n   → Spreadsheet not found or not shared with service account.');
        }
        if (error.message.includes('permission')) {
            console.log('\n   → No permission. Share the sheet with the service account email.');
        }
    }
}

testConnection();
