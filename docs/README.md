# Backend API with Google Sheets

A complete Backend API system using Node.js, Express, and Google Sheets as a database. Features JWT authentication, Cloudinary image uploads, and a comprehensive API for content management.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- Google Cloud account with Sheets API enabled
- Cloudinary account for image uploads

### Installation

1. **Clone and install dependencies**

```bash
cd backend
npm install
```

2. **Configure environment variables**

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

- `GOOGLE_SHEET_ID` - Your Google Sheet ID
- `GOOGLE_SERVICE_ACCOUNT_EMAIL` - Service account email
- `GOOGLE_PRIVATE_KEY` - Service account private key
- `CLOUDINARY_*` - Cloudinary credentials
- `JWT_SECRET` - A secure random string

3. **Set up Google Sheets**

Create a new Google Sheet with these tabs (sheets):
- `website_content`
- `blog_posts`
- `products`
- `categories`
- `settings`
- `menu_items`
- `admin_users`
- `testimonials`
- `faqs`
- `images`
- `contact_messages`

Share the sheet with your service account email (with Editor access).

4. **Start the server**

```bash
npm run dev     # Development with hot reload
npm start       # Production
```

Server runs at `http://localhost:5000`

## 📁 Project Structure

```
backend/
├── server.js              # Express app entry point
├── config/                # Configuration files
│   ├── googleSheets.js    # Google Sheets API
│   ├── cloudinary.js      # Image upload config
│   └── jwt.js             # JWT configuration
├── middleware/            # Express middleware
│   ├── auth.js            # JWT authentication
│   ├── roleCheck.js       # Role-based access
│   ├── errorHandler.js    # Error handling
│   ├── validation.js      # Input validation
│   └── upload.js          # Multer file upload
├── controllers/           # Route controllers
├── routes/                # API routes
├── utils/                 # Helper functions
└── docs/                  # Documentation
```

## 🔐 Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Register First Admin

For initial setup, temporarily modify `routes/authRoutes.js` to allow public registration, then:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","email":"admin@example.com","password":"Admin123!"}'
```

Then restore the protected registration.

## 📚 API Endpoints

| Endpoint | Description |
|----------|-------------|
| `/api/auth` | Authentication (login, register, logout) |
| `/api/content` | Website content management |
| `/api/blog` | Blog posts CRUD |
| `/api/products` | Products CRUD |
| `/api/categories` | Categories management |
| `/api/settings` | Application settings |
| `/api/menu` | Menu items management |
| `/api/users` | Admin user management |
| `/api/testimonials` | Testimonials CRUD |
| `/api/faq` | FAQ management |
| `/api/upload` | Image upload (Cloudinary) |
| `/api/contact` | Contact form messages |
| `/api/stats` | Dashboard statistics |

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for full details.

## 🏗️ Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment guides:
- Railway
- Render
- Vercel (via custom build)

## 📖 Additional Documentation

- [Google Sheets Setup Guide](./GOOGLE_SHEETS_SETUP.md)
- [Cloudinary Setup Guide](./CLOUDINARY_SETUP.md)
- [API Documentation](./API_DOCUMENTATION.md)
- [Deployment Guide](./DEPLOYMENT.md)

## ⚡ Features

- ✅ JWT Authentication with role-based access
- ✅ Google Sheets as database
- ✅ Cloudinary image upload
- ✅ CORS configuration
- ✅ Rate limiting
- ✅ Input validation & sanitization
- ✅ Error handling
- ✅ Pagination support
- ✅ Slug generation
- ✅ Dashboard statistics

## 📝 License

ISC
