# Deployment Guide

Deploy your Backend API to various cloud platforms.

---

## Railway

### 1. Prepare Repository

Push your code to GitHub:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/backend-api.git
git push -u origin main
```

### 2. Deploy on Railway

1. Go to [Railway](https://railway.app)
2. Click **New Project** → **Deploy from GitHub repo**
3. Select your repository
4. Railway auto-detects Node.js and starts deployment

### 3. Configure Environment Variables

In Railway dashboard:
1. Click on your service
2. Go to **Variables** tab
3. Add all variables from `.env.example`:

```
PORT=5000
NODE_ENV=production
JWT_SECRET=<generate-secure-key>
JWT_EXPIRE=7d
GOOGLE_SHEET_ID=<your-sheet-id>
GOOGLE_SERVICE_ACCOUNT_EMAIL=<email>
GOOGLE_PRIVATE_KEY=<private-key>
CLOUDINARY_CLOUD_NAME=<cloud-name>
CLOUDINARY_API_KEY=<api-key>
CLOUDINARY_API_SECRET=<api-secret>
FRONTEND_URL=https://your-frontend.com
ADMIN_URL=https://your-admin.com
```

### 4. Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Configure DNS records as shown

### 5. Get Deployment URL

Railway provides a URL like:
```
https://your-project.up.railway.app
```

---

## Render

### 1. Create Web Service

1. Go to [Render](https://render.com)
2. Click **New** → **Web Service**
3. Connect GitHub and select repository

### 2. Configure Service

- **Name:** backend-api
- **Environment:** Node
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Instance Type:** Free or Starter

### 3. Add Environment Variables

In **Environment** section, add all variables from `.env.example`.

### 4. Deploy

Click **Create Web Service**. Render will:
1. Clone your repo
2. Install dependencies
3. Start your server

### 5. Get URL

Render provides:
```
https://your-service.onrender.com
```

---

## Vercel

> Note: Vercel is optimized for serverless. Some adjustments may be needed.

### 1. Install Vercel CLI

```bash
npm i -g vercel
```

### 2. Create vercel.json

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

### 3. Deploy

```bash
vercel
```

Follow the prompts to deploy.

### 4. Add Environment Variables

```bash
vercel env add GOOGLE_SHEET_ID
# Repeat for all variables
```

Or add in Vercel dashboard: **Settings** → **Environment Variables**

---

## Environment Variables Checklist

Ensure all these are set in production:

| Variable | Required | Notes |
|----------|----------|-------|
| `NODE_ENV` | Yes | Set to `production` |
| `PORT` | No | Platform usually sets this |
| `JWT_SECRET` | Yes | Use a long random string |
| `JWT_EXPIRE` | No | Default: 7d |
| `GOOGLE_SHEET_ID` | Yes | From your Google Sheet URL |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Yes | Service account email |
| `GOOGLE_PRIVATE_KEY` | Yes | Keep `\n` in the key |
| `CLOUDINARY_CLOUD_NAME` | Yes | From Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | Yes | From Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | Yes | From Cloudinary dashboard |
| `FRONTEND_URL` | Yes | Your frontend URL for CORS |
| `ADMIN_URL` | Yes | Your admin panel URL for CORS |

---

## Post-Deployment Checklist

- [ ] Test health endpoint: `GET /api/health`
- [ ] Test login endpoint
- [ ] Verify CORS is working with your frontend
- [ ] Check rate limiting is active
- [ ] Verify image uploads work
- [ ] Test Google Sheets connection

---

## Generate Secure JWT Secret

Use this command to generate a secure secret:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## SSL/HTTPS

All platforms above provide HTTPS by default. For custom domains:

- **Railway:** Auto-configured with Let's Encrypt
- **Render:** Auto-configured with Let's Encrypt
- **Vercel:** Auto-configured

---

## Monitoring

### Railway
- Built-in logs in dashboard
- Metrics available

### Render
- Logs available in dashboard
- Shell access available

### Vercel
- Function logs available
- Analytics in dashboard

---

## Troubleshooting

### "Application Error" on startup
- Check logs for specific error
- Verify all environment variables are set
- Ensure `NODE_ENV=production`

### CORS errors
- Verify `FRONTEND_URL` and `ADMIN_URL` are correct
- Include protocol (https://)

### Database connection errors
- Verify Google Sheets credentials
- Ensure service account has access to the sheet

### Image upload fails
- Check Cloudinary credentials
- Verify file size limits
