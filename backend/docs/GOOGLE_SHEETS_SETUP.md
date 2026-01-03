# Google Sheets Setup Guide

Step-by-step guide to configure Google Sheets as your database.

## 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **Select a project** → **New Project**
3. Enter project name and click **Create**

## 2. Enable Google Sheets API

1. In your project, go to **APIs & Services** → **Library**
2. Search for "Google Sheets API"
3. Click **Enable**

## 3. Create Service Account

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **Service Account**
3. Fill in the details:
   - Service account name: `sheets-api`
   - Description: `Backend API access to Google Sheets`
4. Click **Create and Continue**
5. Skip the optional steps and click **Done**

## 4. Generate API Key

1. Click on your new service account
2. Go to **Keys** tab
3. Click **Add Key** → **Create new key**
4. Select **JSON** and click **Create**
5. Save the downloaded file securely

## 5. Get Credentials

From the JSON file, extract:

```
GOOGLE_SERVICE_ACCOUNT_EMAIL = <client_email>
GOOGLE_PRIVATE_KEY = <private_key>
```

**Important:** The private key contains `\n` characters. Keep them as-is in your `.env` file.

## 6. Create Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new blank spreadsheet
3. Rename it (e.g., "Backend Database")

### Get Sheet ID

The Sheet ID is in the URL:
```
https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit
```

### Share with Service Account

1. Click **Share** button
2. Add your service account email (from credentials)
3. Give **Editor** access
4. Click **Share**

## 7. Create Sheet Tabs

Create these tabs (sheets) with the exact names:

| Tab Name | Headers (Row 1) |
|----------|-----------------|
| `website_content` | id, page, section, content, image_url, order, created_at, updated_at |
| `blog_posts` | id, title, slug, content, excerpt, category, author, date, image_url, status, views, created_at, updated_at |
| `products` | id, name, slug, price, description, image_url, gallery_urls, category, stock, sku, status, created_at, updated_at |
| `categories` | id, name, slug, type, description, order, status |
| `settings` | id, setting_key, setting_value, setting_type, updated_at |
| `menu_items` | id, label, url, parent_id, order, target, status |
| `admin_users` | id, username, email, password_hash, role, status, last_login, created_at |
| `testimonials` | id, name, designation, review, rating, image_url, status, order, created_at |
| `faqs` | id, question, answer, category, order, status, created_at |
| `images` | id, filename, url, cloudinary_id, size, width, height, format, upload_date |
| `contact_messages` | id, name, email, phone, subject, message, status, created_at |

### Quick Setup

Copy this to Row 1 of each tab:

**website_content:**
```
id	page	section	content	image_url	order	created_at	updated_at
```

**blog_posts:**
```
id	title	slug	content	excerpt	category	author	date	image_url	status	views	created_at	updated_at
```

**products:**
```
id	name	slug	price	description	image_url	gallery_urls	category	stock	sku	status	created_at	updated_at
```

**categories:**
```
id	name	slug	type	description	order	status
```

**settings:**
```
id	setting_key	setting_value	setting_type	updated_at
```

**menu_items:**
```
id	label	url	parent_id	order	target	status
```

**admin_users:**
```
id	username	email	password_hash	role	status	last_login	created_at
```

**testimonials:**
```
id	name	designation	review	rating	image_url	status	order	created_at
```

**faqs:**
```
id	question	answer	category	order	status	created_at
```

**images:**
```
id	filename	url	cloudinary_id	size	width	height	format	upload_date
```

**contact_messages:**
```
id	name	email	phone	subject	message	status	created_at
```

## 8. Configure Environment

Add to your `.env`:

```env
GOOGLE_SHEET_ID=your_sheet_id_here
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour_Key_Here\n-----END PRIVATE KEY-----\n"
```

## 9. Test Connection

Start your server and check the logs:
```bash
npm run dev
```

If configured correctly, the server will start without errors.

## Troubleshooting

### "PERMISSION_DENIED" Error
- Verify the sheet is shared with the service account email
- Ensure the service account has Editor access

### "Invalid private key" Error
- Check that the private key includes `\n` characters
- Wrap the entire key in quotes in `.env`

### "Sheet not found" Error
- Verify the sheet tab names match exactly
- Check the GOOGLE_SHEET_ID is correct
