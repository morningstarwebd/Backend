
require('dotenv').config();
const { SHEETS, getSheetData } = require('./config/googleSheets');

async function testAdmin() {
    console.log('Testing access to admin_users...');
    try {
        const data = await getSheetData(SHEETS.ADMIN_USERS);
        console.log('✅ Success! Found', data.length, 'users.');
        console.log(data);
    } catch (error) {
        console.error('❌ Failed:', error.message);
    }
}

testAdmin();
