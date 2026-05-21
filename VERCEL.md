# Deploy frontend on Vercel + API on Render

## Architecture

| Part | Host |
|------|------|
| Website | **Vercel** (`client/`) |
| API | **Render** (`server/`) |
| Database | MongoDB Atlas |
| Images | Cloudinary |

---

## 1. Vercel — import project

1. [vercel.com](https://vercel.com) → **Add New** → **Project**
2. Import GitHub repo `premiumpick07`
3. Settings:

| Setting | Value |
|---------|--------|
| **Framework** | Next.js |
| **Root Directory** | `client` |
| **Build Command** | `npm run build` (default) |

---

## 2. Vercel — environment variables

**Project → Settings → Environment Variables** (Production + Preview):

| Key | Value |
|-----|--------|
| `NEXT_PUBLIC_API_URL` | `https://YOUR-API.onrender.com/api` |
| `NEXT_PUBLIC_SITE_URL` | `https://YOUR-PROJECT.vercel.app` |
| `NEXT_PUBLIC_SITE_NAME` | `Premium Picks` |
| `NEXT_PUBLIC_SITE_DESCRIPTION` | Your tagline |
| `ADMIN_PATH` | Your secret path (e.g. `cp-x7k9m2n4p1q8`) |

Redeploy after adding variables (`ADMIN_PATH` is used at **build** time).

---

## 3. Render — update CORS for Vercel

**Render → Environment** → set:

```env
CLIENT_URL=https://YOUR-PROJECT.vercel.app
```

- Use **https**
- **No** trailing slash
- If you add a custom domain later, update this and redeploy Render

Also ensure Render has: `MONGODB_URI`, `JWT_SECRET`, `UPLOAD_PROVIDER=cloudinary`, Cloudinary keys, `SERVER_URL=https://YOUR-API.onrender.com`

**Manual Deploy** on Render after saving env vars.

---

## 4. Your URLs

```
Store:  https://your-project.vercel.app
Admin:  https://your-project.vercel.app/YOUR_ADMIN_PATH
API:    https://your-api.onrender.com/api/health
```

---

## 5. Local dev (optional)

Keep `client/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Keep `server/.env`:

```env
CLIENT_URL=http://localhost:3000
```

Run API + `npm run dev` in `client/`.

---

## Vercel environment variables

Add the following to Vercel project settings:

```env
NEXT_PUBLIC_API_URL=https://premiumpick07.onrender.com/api
NEXT_PUBLIC_SITE_URL=https://your-project.vercel.app
```

Then redeploy the frontend.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Failed to fetch | `NEXT_PUBLIC_API_URL` must be Render URL, not localhost |
| CORS error | Render `CLIENT_URL` must exactly match Vercel URL |
| Admin 404 | Redeploy Vercel after changing `ADMIN_PATH` |
| Images broken | Cloudinary on Render; redeploy Vercel after API URL set |
