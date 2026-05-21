# Vercel + Render — fix checklist

## Admin panel URLs (try in order)

1. **https://premiumpick07.vercel.app/cp-x7k9m2n4p1q8**
2. If 404, try: **https://premiumpick07.vercel.app/cp-internal-manage**

After redeploy with latest code, only your `ADMIN_PATH` from Vercel env will matter.

---

## Required Vercel environment variables

**Settings → Environment Variables → Production:**

```
NEXT_PUBLIC_API_URL=https://premiumpick07.onrender.com/api
NEXT_PUBLIC_SITE_URL=https://premiumpick07.vercel.app
ADMIN_PATH=cp-x7k9m2n4p1q8
NEXT_PUBLIC_SITE_NAME=Premium Picks
```

Use **NEXT_PUBLIC_** (all caps). Then **Redeploy**.

---

## Required Render environment variables

```
CLIENT_URL=https://premiumpick07.vercel.app
SERVER_URL=https://premiumpick07.onrender.com
MONGODB_URI=your_atlas_uri
JWT_SECRET=32+_chars
UPLOAD_PROVIDER=cloudinary
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
NODE_ENV=production
```

**Root Directory:** `server`  
**Start Command:** `npm start`

---

## Wake up Render (free tier)

Open in browser first (wait 30–60 seconds):

**https://premiumpick07.onrender.com/api/health**

Must show: `{"success":true,"message":"API is running"}`

If this fails, admin login on Vercel will not work.

---

## Admin login

| Field | Value |
|--------|--------|
| URL | `https://premiumpick07.vercel.app/cp-x7k9m2n4p1q8` |
| Username | `admin` |
| Password | Your `ADMIN_PASSWORD` from Render (or local seed) |

---

## Push latest fixes

```powershell
cd "c:\Users\prince\3D Objects\Imp Project\affliate_product"
git add .
git commit -m "fix: admin panel routing on Vercel"
git push origin main
```

Vercel auto-redeploys from GitHub.
