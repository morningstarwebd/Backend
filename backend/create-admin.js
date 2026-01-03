// Create first admin user
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { SHEETS, appendRow, getSheetData } = require('./config/googleSheets');

async function createAdmin() {
    console.log('Creating first admin user...');

    // Check if admin already exists
    const users = await getSheetData(SHEETS.ADMIN_USERS);
    if (users.length > 0) {
        console.log('Admin user already exists!');
        console.log('Existing users:', users.map(u => u.email));
        return;
    }

    // Hash password
    const password = 'Admin123!';
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create admin user
    const adminUser = {
        id: 'usr_' + Date.now(),
        username: 'admin',
        email: 'admin@example.com',
        password_hash: passwordHash,
        role: 'super_admin',
        status: 'active',
        last_login: '',
        created_at: new Date().toISOString()
    };

    await appendRow(SHEETS.ADMIN_USERS, adminUser);

    console.log('✅ Admin user created successfully!');
    console.log('');
    console.log('Login credentials:');
    console.log('  Email:', adminUser.email);
    console.log('  Password:', password);
}

createAdmin().catch(console.error);
