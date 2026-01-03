
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { SHEETS, appendRow, getSheetData } = require('./config/googleSheets');

async function addNewAdmin() {
    const email = 'samimaktar081@gmail.com';
    const password = 'S@mim143@';
    const username = 'samim';

    console.log(`Adding new admin user: ${email}...`);

    // Check if user already exists
    const users = await getSheetData(SHEETS.ADMIN_USERS);
    const exists = users.find(u => u.email === email);

    if (exists) {
        console.log('⚠️ User already exists!');
        return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create admin user
    const newUser = {
        id: 'usr_' + Date.now(),
        username: username,
        email: email,
        password_hash: passwordHash,
        role: 'super_admin', // Giving super_admin role
        status: 'active',
        last_login: '',
        created_at: new Date().toISOString()
    };

    await appendRow(SHEETS.ADMIN_USERS, newUser);

    console.log('✅ New Admin user created successfully!');
    console.log('   Email:', email);
    console.log('   Password:', password);
}

addNewAdmin().catch(console.error);
