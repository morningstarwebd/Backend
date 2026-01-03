# Cloudinary Setup Guide

Configure Cloudinary for image upload and management.

## 1. Create Account

1. Go to [Cloudinary](https://cloudinary.com)
2. Sign up for a free account
3. Verify your email

## 2. Get Credentials

1. Log in to your Cloudinary Dashboard
2. Find your credentials on the dashboard:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

## 3. Configure Environment

Add to your `.env`:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 4. Upload Settings (Optional)

### Configure Upload Preset

1. Go to **Settings** → **Upload**
2. Click **Add upload preset**
3. Configure:
   - Preset name: `backend-uploads`
   - Signing Mode: Signed
   - Folder: `backend-uploads`
4. Save

### Recommended Transformations

The API automatically applies these optimizations:
- Quality: Auto
- Format: Auto (WebP for supported browsers)

## 5. File Size Limits

Default limits in the API:
- **Images:** 5MB max
- **Documents:** 10MB max

To change, edit `middleware/upload.js`:

```javascript
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
```

## 6. Supported Formats

### Images
- JPEG/JPG
- PNG
- GIF
- WebP

### Documents (if needed)
- PDF
- DOC/DOCX

## 7. Usage

### Upload Single Image

```bash
curl -X POST http://localhost:5000/api/upload/single \
  -H "Authorization: Bearer <token>" \
  -F "image=@/path/to/image.jpg"
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "img_abc123",
    "url": "https://res.cloudinary.com/your-cloud/image/upload/...",
    "cloudinary_id": "backend-uploads/abc123",
    "width": "800",
    "height": "600"
  }
}
```

### Upload Multiple Images

```bash
curl -X POST http://localhost:5000/api/upload/multiple \
  -H "Authorization: Bearer <token>" \
  -F "images=@/path/to/image1.jpg" \
  -F "images=@/path/to/image2.jpg"
```

### Delete Image

```bash
curl -X DELETE http://localhost:5000/api/images/img_abc123 \
  -H "Authorization: Bearer <token>"
```

## 8. Image Transformations

Get optimized URLs using Cloudinary's URL API:

```
https://res.cloudinary.com/{cloud_name}/image/upload/{transformations}/{public_id}
```

Examples:
- Thumbnail: `/w_150,h_150,c_fill/`
- Resize: `/w_800,h_600,c_limit/`
- Quality: `/q_auto,f_auto/`

## 9. Free Tier Limits

Cloudinary free tier includes:
- 25 Credits per month
- 25GB storage
- 25GB bandwidth

Monitor usage in the Cloudinary dashboard.

## Troubleshooting

### "Invalid API credentials"
- Double-check your cloud name, API key, and API secret
- Ensure no extra spaces in `.env` values

### "Upload failed"
- Check file size limits
- Verify file format is supported
- Check Cloudinary account status

### "Resource not found" on delete
- The image may have already been deleted
- Check the cloudinary_id in the images sheet
