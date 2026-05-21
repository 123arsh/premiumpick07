# Deployment Guide — Affiliate Product Site

Deploy in this order: **MongoDB Atlas** (done) → **Cloudinary** → **Backend (Render)** → **Frontend (Vercel)** → **Seed admin**.

Recommended stack (free tiers available):

| Part | Service | Why |
|------|---------|-----|
| Database | MongoDB Atlas | You already use this |
| API | [Render](https://render.com) | Simple Node.js hosting |
| Images | [Cloudinary](https://cloudinary.com) | Required in production (server disk is temporary) |
| Website | [Vercel](https://vercel.com) | Built for Next.js |

---

## Before you deploy

1. Push the project to **GitHub** (private repo recommended).
2. Generate a new **JWT secret** (64+ random characters) — do not reuse the local one in production.
3. Pick a new **hidden admin path** for production (different from local).
4. Use a **strong admin password** in production.

---

## Step 1 — MongoDB Atlas (production)

1. Go to [MongoDB Atlas](https://cloud.mongodb.com) → your cluster.
2. **Network Access** → Add IP Address → **Allow Access from Anywhere** (`0.0.0.0/0`)  
   *(Required so Render/Vercel can reach Atlas. For stricter security, use Render’s outbound IPs later.)*
3. **Database Access** → ensure your DB user exists with **read/write** on the database.
4. **Connect** → Drivers → copy the connection string (no `<` `>` around password).
5. Append database name if missing:
   ```
   ...mongodb.net/affiliate_products?retryWrites=true&w=majority
   ```

---

## Step 2 — Cloudinary (image uploads)

Local `uploads/` folder does **not** persist on Render/Railway. Use Cloudinary in production.

1. Sign up at [cloudinary.com](https://cloudinary.com).
2. Dashboard → copy **Cloud name**, **API Key**, **API Secret**.
3. You will add these to the backend env in Step 3.

---

## Step 3 — Deploy backend (Render)

### 3.1 Create Web Service

1. [render.com](https://render.com) → **New +** → **Web Service**.
2. Connect your GitHub repo.
3. Settings:

| Setting | Value |
|---------|--------|
| **Name** | `affiliate-api` (or any name) |
| **Root Directory** | `server` |
| **Runtime** | Node |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` (not `npm run dev`) |
| **Instance type** | Free (or paid for always-on) |

### 3.2 Environment variables (Render → Environment)

Add every variable below:

```env
NODE_ENV=production
PORT=5000

MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/affiliate_products?retryWrites=true&w=majority

JWT_SECRET=paste_64_char_random_secret_here
JWT_EXPIRES_IN=7d

ADMIN_USERNAME=admin
ADMIN_PASSWORD=YourVeryStrongProductionPassword!

SERVER_URL=https://YOUR-API-NAME.onrender.com
CLIENT_URL=https://YOUR-SITE.vercel.app

UPLOAD_PROVIDER=cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

LOGIN_RATE_LIMIT_WINDOW_MS=900000
LOGIN_RATE_LIMIT_MAX=5
```

**Important:**
- `SERVER_URL` = your Render URL (no trailing slash), e.g. `https://affiliate-api.onrender.com`
- `CLIENT_URL` = your Vercel URL (add after Step 4, then redeploy API once)
- First deploy can use a placeholder for `CLIENT_URL`, then update after Vercel is live.

### 3.3 Deploy & seed admin

1. Click **Deploy** and wait until status is **Live**.
2. Test: open `https://YOUR-API-NAME.onrender.com/api/health` → should show `{"success":true,...}`.
3. Seed admin **once** (from your PC):

```powershell
cd "c:\Users\prince\3D Objects\Imp Project\affliate_product\server"
# Temporarily point .env MONGODB_URI to same Atlas DB (already is)
# Set ADMIN_PASSWORD to match Render's ADMIN_PASSWORD
npm run seed:admin
```

Or use Render **Shell** (paid) / run seed locally against production `MONGODB_URI`.

---

## Step 4 — Deploy frontend (Vercel)

### 4.1 Import project

1. [vercel.com](https://vercel.com) → **Add New** → **Project**.
2. Import the same GitHub repo.
3. Settings:

| Setting | Value |
|---------|--------|
| **Framework Preset** | Next.js |
| **Root Directory** | `affliate_product/client` |
| **Build Command** | `npm run build` (default) |
| **Output** | default |

### 4.2 Environment variables (Vercel → Settings → Environment Variables)

```env
NEXT_PUBLIC_SITE_NAME=Premium Picks
NEXT_PUBLIC_SITE_DESCRIPTION=Curated affiliate product recommendations
NEXT_PUBLIC_SITE_URL=https://YOUR-SITE.vercel.app
NEXT_PUBLIC_API_URL=https://YOUR-API-NAME.onrender.com/api

ADMIN_PATH=your-secret-production-path-no-slashes
```

Example admin URL after deploy:
`https://your-site.vercel.app/your-secret-production-path`

**Do not** use `NEXT_PUBLIC_` for `ADMIN_PATH` — it is injected at build time via `next.config.ts` `env` block from `ADMIN_PATH` only.

### 4.3 Allow API images in Next.js

After you know your Render URL, add it to `client/next.config.ts` under `images.remotePatterns` if you ever serve images from the API host (Cloudinary uses `res.cloudinary.com`, already allowed).

Redeploy Vercel after changing `next.config.ts`.

### 4.4 Deploy

Click **Deploy**. Copy your live URL, e.g. `https://affiliate-store.vercel.app`.

---

## Step 5 — Connect frontend & backend

1. **Render** → update `CLIENT_URL` to your exact Vercel URL (no trailing slash):
   ```
   CLIENT_URL=https://affiliate-store.vercel.app
   ```
2. **Manual Deploy** on Render to apply CORS change.
3. Open Vercel site → confirm products load (empty grid until you add products).
4. Open admin: `https://YOUR-SITE.vercel.app/YOUR_ADMIN_PATH`
5. Log in and add a test product with an image.

---

## Step 6 — Custom domain (optional)

**Vercel:** Project → Settings → Domains → add `www.yoursite.com`.

**Render:** Settings → Custom Domain → add `api.yoursite.com`.

Then update:

| Variable | New value |
|----------|-----------|
| `CLIENT_URL` | `https://www.yoursite.com` |
| `SERVER_URL` | `https://api.yoursite.com` |
| `NEXT_PUBLIC_SITE_URL` | `https://www.yoursite.com` |
| `NEXT_PUBLIC_API_URL` | `https://api.yoursite.com/api` |

Redeploy both services.

---

## Production checklist

- [ ] New `JWT_SECRET` (never committed to Git)
- [ ] Strong `ADMIN_PASSWORD` on Render
- [ ] Unique `ADMIN_PATH` on Vercel (long random string)
- [ ] `UPLOAD_PROVIDER=cloudinary` on Render
- [ ] Atlas Network Access allows cloud hosts
- [ ] `CLIENT_URL` matches Vercel URL exactly (https, no trailing slash)
- [ ] `.env` and `.env.local` are **not** in GitHub
- [ ] Admin URL bookmarked privately — not shared publicly
- [ ] Run `seed:admin` once against production DB (if admin not created)

---

## Alternative backends

| Platform | Root dir | Start command |
|----------|----------|---------------|
| **Railway** | `affliate_product/server` | `npm start` |
| **Fly.io** | `server` + Dockerfile | `node src/index.js` |

Same environment variables as Render.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| CORS error in browser | `CLIENT_URL` on Render must exactly match Vercel URL |
| Login works locally, not live | Check `NEXT_PUBLIC_API_URL` points to Render `/api` |
| Images broken after upload | Set Cloudinary vars + `UPLOAD_PROVIDER=cloudinary` |
| `bad auth` MongoDB | Fix Atlas URI (no `<>`, URL-encode password) |
| Render sleeps (free tier) | First request may take ~30s; upgrade or use cron ping |
| Admin 404 | Redeploy Vercel after changing `ADMIN_PATH`; path is build-time |

---

## Quick reference — your URLs after deploy

```
Storefront:  https://YOUR-SITE.vercel.app
Admin:       https://YOUR-SITE.vercel.app/YOUR_ADMIN_PATH
API health:  https://YOUR-API.onrender.com/api/health
```

---

## Git push reminder

From project root:

```powershell
cd "c:\Users\prince\3D Objects\Imp Project\affliate_product"
git init
git add .
git commit -m "Affiliate product site ready for deploy"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

Ensure `.gitignore` excludes `.env`, `.env.local`, and `node_modules/`.
