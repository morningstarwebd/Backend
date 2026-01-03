# API Documentation

Complete reference for all API endpoints.

## Base URL

```
http://localhost:5000/api
```

## Authentication

All protected routes require a JWT token:

```
Authorization: Bearer <token>
```

---

## Auth Endpoints

### POST /auth/register
Create new admin user (protected).

**Body:**
```json
{
  "username": "admin",
  "email": "admin@example.com",
  "password": "Admin123!",
  "role": "admin"
}
```

### POST /auth/login
Login and get token.

**Body:**
```json
{
  "email": "admin@example.com",
  "password": "Admin123!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { "id": "...", "email": "..." },
    "token": "eyJhbG..."
  }
}
```

### GET /auth/verify
Verify JWT token validity.

### GET /auth/me
Get current user info (protected).

### PUT /auth/change-password
Change password (protected).

**Body:**
```json
{
  "currentPassword": "OldPass123!",
  "newPassword": "NewPass456!"
}
```

---

## Blog Endpoints

### GET /blog
Get all posts (public shows published only).

**Query:** `?page=1&limit=10&status=published&category=tech&search=keyword`

### GET /blog/:id
Get post by ID.

### GET /blog/slug/:slug
Get post by slug.

### GET /blog/category/:cat
Get posts by category.

### POST /blog (protected)
Create new post.

**Body:**
```json
{
  "title": "My Post",
  "content": "<p>Content here</p>",
  "excerpt": "Short description",
  "category": "tech",
  "status": "draft"
}
```

### PUT /blog/:id (protected)
Update post.

### DELETE /blog/:id (protected)
Delete post.

### PUT /blog/:id/view
Increment view count.

---

## Products Endpoints

### GET /products
Get all products (public shows active only).

**Query:** `?page=1&limit=10&category=electronics&minPrice=10&maxPrice=100`

### GET /products/:id
Get product by ID.

### GET /products/slug/:slug
Get product by slug.

### GET /products/category/:cat
Get products by category.

### POST /products (protected)
Create product.

**Body:**
```json
{
  "name": "Product Name",
  "price": 99.99,
  "description": "Description",
  "category": "electronics",
  "stock": 100,
  "sku": "PROD-001",
  "status": "active"
}
```

### PUT /products/:id (protected)
Update product.

### DELETE /products/:id (protected)
Delete product.

---

## Categories Endpoints

### GET /categories
Get all categories.

**Query:** `?type=blog&status=active`

### GET /categories/:id
Get category by ID.

### GET /categories/type/:type
Get categories by type (blog/product/faq).

### POST /categories (protected)
Create category.

**Body:**
```json
{
  "name": "Technology",
  "type": "blog",
  "description": "Tech posts",
  "order": 1,
  "status": "active"
}
```

### PUT /categories/:id (protected)
Update category.

### DELETE /categories/:id (protected)
Delete category.

---

## Settings Endpoints

### GET /settings (protected)
Get all settings as key-value object.

### GET /settings/:key (protected)
Get setting by key.

### PUT /settings (protected)
Bulk update settings.

**Body:**
```json
{
  "settings": {
    "site_name": "My Site",
    "contact_email": { "value": "info@site.com", "type": "string" }
  }
}
```

### PUT /settings/:key (protected)
Update single setting.

---

## Menu Endpoints

### GET /menu
Get menu items (public shows active only). Returns flat list and tree structure.

### POST /menu (protected)
Create menu item.

**Body:**
```json
{
  "label": "About",
  "url": "/about",
  "parent_id": "",
  "order": 1,
  "target": "_self",
  "status": "active"
}
```

### PUT /menu/reorder (protected)
Reorder menu items.

**Body:**
```json
{
  "items": [
    { "id": "mnu_123", "order": 0 },
    { "id": "mnu_456", "order": 1 }
  ]
}
```

### PUT /menu/:id (protected)
Update menu item.

### DELETE /menu/:id (protected)
Delete menu item (also deletes children).

---

## Users Endpoints (Admin Only)

### GET /users
Get all admin users.

### GET /users/:id
Get user by ID.

### POST /users
Create new user.

### PUT /users/:id
Update user.

### DELETE /users/:id
Delete user.

### PUT /users/:id/status
Change user status.

**Body:**
```json
{
  "status": "inactive"
}
```

---

## Testimonials Endpoints

### GET /testimonials
Get testimonials (public shows active only).

### POST /testimonials (protected)
Create testimonial.

**Body:**
```json
{
  "name": "John Doe",
  "designation": "CEO, Company",
  "review": "Great service!",
  "rating": 5,
  "status": "active"
}
```

### PUT /testimonials/reorder (protected)
Reorder testimonials.

### PUT /testimonials/:id (protected)
Update testimonial.

### DELETE /testimonials/:id (protected)
Delete testimonial.

---

## FAQ Endpoints

### GET /faq
Get FAQs (public shows active only). Returns flat list and grouped by category.

### GET /faq/category/:cat
Get FAQs by category.

### POST /faq (protected)
Create FAQ.

**Body:**
```json
{
  "question": "How does it work?",
  "answer": "It works like this...",
  "category": "General",
  "order": 1
}
```

### PUT /faq/reorder (protected)
Reorder FAQs.

### PUT /faq/:id (protected)
Update FAQ.

### DELETE /faq/:id (protected)
Delete FAQ.

---

## Upload Endpoints (Protected)

### POST /upload/single
Upload single image.

**Form Data:** `image` (file)

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "img_123",
    "url": "https://res.cloudinary.com/...",
    "cloudinary_id": "backend-uploads/abc123"
  }
}
```

### POST /upload/multiple
Upload multiple images (max 10).

**Form Data:** `images` (files)

### GET /images
Get all uploaded images.

### DELETE /images/:id
Delete image from Cloudinary and database.

---

## Contact Endpoints

### POST /contact (public)
Submit contact form.

**Body:**
```json
{
  "name": "John",
  "email": "john@example.com",
  "phone": "1234567890",
  "subject": "Inquiry",
  "message": "Hello..."
}
```

### GET /contact (protected)
Get all messages with stats.

### GET /contact/:id (protected)
Get message (marks as read).

### PUT /contact/:id/status (protected)
Update message status.

**Body:**
```json
{
  "status": "replied"
}
```

### DELETE /contact/:id (protected)
Delete message.

---

## Stats Endpoints (Protected)

### GET /stats
Get dashboard statistics overview.

### GET /stats/overview
Get detailed statistics by entity.

### GET /stats/recent
Get recent activities feed.

---

## Response Format

### Success
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error
```json
{
  "success": false,
  "message": "Error message",
  "errors": [ ... ]
}
```

### Pagination
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "pages": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 500 | Server Error |
