# Render environment variables (required)

Copy these into **Render → your service → Environment**.

| Key | Required | Example / notes |
|-----|----------|-----------------|
| `NODE_ENV` | Yes | `production` |
| `MONGODB_URI` | Yes | Atlas connection string, no `<>` around password |
| `JWT_SECRET` | Yes | Min 32 characters |
| `JWT_EXPIRES_IN` | No | `7d` |
| `ADMIN_USERNAME` | No | `admin` |
| `ADMIN_PASSWORD` | No | For seed / `npm run admin:password` |
| `ADMIN_RESET_SECRET` | Yes | Recovery secret for forgot-password flow |
| `SERVER_URL` | Yes | `https://YOUR-SERVICE.onrender.com` |
| `CLIENT_URL` | Yes | `https://YOUR-SITE.netlify.app` |
| `UPLOAD_PROVIDER` | Yes | `cloudinary` |
| `CLOUDINARY_CLOUD_NAME` | Yes if cloudinary | From Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | Yes if cloudinary | |
| `CLOUDINARY_API_SECRET` | Yes if cloudinary | |

**Do not set `PORT`** — Render sets it automatically.

## MongoDB Atlas

1. **Network Access** → Add `0.0.0.0/0` (allow from anywhere)
2. **Database Access** → user/password match URI
3. URI format:
   ```
   mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/affiliate_products?retryWrites=true&w=majority
   ```

## Render build settings

| Setting | Value |
|---------|--------|
| Root Directory | `server` |
| Build Command | `npm install` |
| Start Command | `npm start` |
