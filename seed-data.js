
require('dotenv').config();
const { SHEETS, appendRow, getSheetData } = require('./config/googleSheets');

async function seedData() {
    console.log('🌱 Starting Database Seeding...');

    const sampleData = {
        [SHEETS.CATEGORIES]: {
            id: 'cat_seed_01',
            name: 'Technology',
            slug: 'technology',
            type: 'blog',
            description: 'Tech news and reviews',
            order: '1',
            status: 'active'
        },
        [SHEETS.BLOG_POSTS]: {
            id: 'blog_seed_01',
            title: 'Welcome to Our New Website',
            slug: 'welcome-new-website',
            content: 'This is a sample blog post to verify the database connection.',
            excerpt: 'Welcome to our new site!',
            category: 'technology',
            author: 'Admin',
            date: new Date().toISOString(),
            image_url: 'https://via.placeholder.com/800x400',
            status: 'published',
            views: '0',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        [SHEETS.PRODUCTS]: {
            id: 'prod_seed_01',
            name: 'Premium Headphones',
            slug: 'premium-headphones',
            price: '299.99',
            description: 'High quality noise cancelling headphones.',
            image_url: 'https://via.placeholder.com/500',
            gallery_urls: '[]',
            category: 'electronics',
            stock: '50',
            sku: 'PH-001',
            status: 'active',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        [SHEETS.FAQS]: {
            id: 'faq_seed_01',
            question: 'Do you offer international shipping?',
            answer: 'Yes, we ship worldwide.',
            category: 'shipping',
            order: '1',
            status: 'active',
            created_at: new Date().toISOString()
        },
        [SHEETS.TESTIMONIALS]: {
            id: 'test_seed_01',
            name: 'John Doe',
            designation: 'CEO, Tech Corp',
            review: 'Amazing service and great products!',
            rating: '5',
            image_url: 'https://via.placeholder.com/100',
            status: 'active',
            order: '1',
            created_at: new Date().toISOString()
        },
        [SHEETS.MENU_ITEMS]: {
            id: 'menu_seed_01',
            label: 'Home',
            url: '/',
            parent_id: '',
            order: '1',
            target: '_self',
            status: 'active'
        },
        [SHEETS.SETTINGS]: {
            id: 'sett_seed_01',
            setting_key: 'site_title',
            setting_value: 'My Awesome CMS',
            setting_type: 'text',
            updated_at: new Date().toISOString()
        },
        [SHEETS.WEBSITE_CONTENT]: {
            id: 'content_seed_01',
            page: 'home',
            section: 'hero',
            content: 'Welcome to our platform',
            image_url: '',
            order: '1',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        },
        [SHEETS.CONTACT_MESSAGES]: {
            id: 'msg_seed_01',
            name: 'Visitor',
            email: 'visitor@example.com',
            phone: '1234567890',
            subject: 'Hello',
            message: 'Just testing the contact form.',
            status: 'new',
            created_at: new Date().toISOString()
        }
    };

    for (const [sheetName, data] of Object.entries(sampleData)) {
        try {
            console.log(`\nProcessing ${sheetName}...`);
            // Check if seed data already exists to avoid duplicates
            const existing = await getSheetData(sheetName);
            const exists = existing.some(row => row.id === data.id);

            if (exists) {
                console.log(`   ⚠️ Data already exists in ${sheetName}, skipping.`);
            } else {
                await appendRow(sheetName, data);
                console.log(`   ✅ Added sample data to ${sheetName}`);
            }
        } catch (error) {
            console.error(`   ❌ Failed to seed ${sheetName}:`, error.message);
        }
    }

    console.log('\n✅ Seeding complete!');
}

seedData();
