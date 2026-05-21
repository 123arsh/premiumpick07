# Affiliate Product Listing Website

Production-ready affiliate product showcase with a **hidden, JWT-protected admin panel**. No public signup — only you manage products.

## Features

### Public storefront
- Responsive product grid with equal-sized cards
- Image hover title overlay with smooth animations
- Entire card opens affiliate link in a new tab
- Search and category filters
- Infinite scroll / load more
- Dark/light theme
- Lazy-loaded images, SEO metadata, sitemap & robots

### Hidden admin
- Custom secret URL (not linked anywhere on the site)
- JWT + httpOnly cookie authentication
- bcrypt password hashing
- Login rate limiting
- Add / edit / delete products with image upload

## Project structure

```
affliate_product/
├── client/                 # Next.js 15 + Tailwind + Framer Motion
│   ├── src/
│   │   ├── app/            # Pages (public + /manage internal)
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── styles/
│   │   └── types/
│   └── ...
├── server/                 # Express + MongoDB
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── utils/
│   └── uploads/
└── README.md
```

## Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

## Installation

### 1. Clone / open project

```bash
cd affliate_product
```

### 2. Backend setup

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Min 32 random characters |
| `ADMIN_USERNAME` | Admin login username |
| `ADMIN_PASSWORD` | Strong password for seed |
| `CLIENT_URL` | `http://localhost:3000` (comma-separated for multiple) |
| `SERVER_URL` | `http://localhost:5000` (for image URLs) |

```bash
npm install
npm run seed:admin
npm run dev
```

Server runs at **http://localhost:5000**

### 3. Frontend setup

```bash
cd ../client
cp .env.example .env.local
```

Edit `client/.env.local`:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:5000/api` |
| `ADMIN_PATH` | **Secret path** e.g. `cp-x7k9m2n4p1q8` (no slash) |
| `NEXT_PUBLIC_SITE_NAME` | Your brand name |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` (production domain later) |

```bash
npm install
npm run dev
```

Storefront: **http://localhost:3000**

## Admin access (important)

1. Set `ADMIN_PATH` in `client/.env.local` to a long random string only you know.
2. Restart the Next.js dev server after changing env vars.
3. Open: `http://localhost:3000/{YOUR_ADMIN_PATH}`  
   Example: `http://localhost:3000/cp-x7k9m2n4p1q8`
4. Log in with credentials from `server/.env` (created via `npm run seed:admin`).

**Security notes:**
- The admin path is **never** shown in navigation, footer, or sitemap.
- `/manage` is blocked from direct browser access (middleware redirect).
- `robots.txt` disallows the admin path.
- Change default password immediately after first login (re-run seed on a fresh DB or update password in MongoDB).

## API reference

### Public

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List products (`page`, `limit`, `search`, `category`) |
| GET | `/api/products/categories` | Distinct categories |

### Admin (JWT required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/login` | Login (rate limited) |
| POST | `/api/admin/logout` | Logout |
| GET | `/api/admin/me` | Current admin |
| GET | `/api/admin/products` | All products (incl. inactive) |
| POST | `/api/admin/products` | Create (multipart: `image`, fields) |
| PUT | `/api/admin/products/:id` | Update |
| DELETE | `/api/admin/products/:id` | Delete |

### Product fields

- `name` — visible title under image
- `hoverTitle` — overlay on image hover
- `affiliateLink` — URL opened on click
- `category` — optional
- `description` — optional
- `image` — file upload (required on create)

## Database schema

**Product**
```js
{
  name: String,
  hoverTitle: String,
  imageUrl: String,
  affiliateLink: String,
  category: String,
  description: String,
  isActive: Boolean,
  createdAt, updatedAt
}
```

**Admin**
```js
{
  username: String (unique),
  password: String (bcrypt hashed)
}
```

## Image storage

Default: **local** uploads in `server/uploads/` (optimized to WebP via Sharp).

For production CDN, set in `server/.env`:

```
UPLOAD_PROVIDER=cloudinary
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

## Deployment guide

### Backend (e.g. Railway, Render, VPS)

1. Set all `server/.env` variables for production.
2. Use MongoDB Atlas for `MONGODB_URI`.
3. Set `NODE_ENV=production`, strong `JWT_SECRET`, `CLIENT_URL` to your frontend domain.
4. Run `npm run seed:admin` once.
5. Use Cloudinary or persistent volume for uploads.

### Frontend (e.g. Vercel)

1. Set env vars in Vercel dashboard (mirror `.env.local`).
2. Set `ADMIN_PATH` — **same secret** as used locally.
3. Update `NEXT_PUBLIC_API_URL` to production API URL.
4. Add production API host to `next.config.ts` `images.remotePatterns` if needed.

### Security checklist

- [ ] Change `ADMIN_PATH` to a unique random string
- [ ] Use 64+ char `JWT_SECRET`
- [ ] Strong `ADMIN_PASSWORD`; never commit `.env`
- [ ] HTTPS only in production (`secure` cookies enabled automatically)
- [ ] Restrict `CLIENT_URL` to your domain only
- [ ] Keep dependencies updated
- [ ] Do not expose admin link publicly

## Scripts

| Location | Command | Purpose |
|----------|---------|---------|
| server | `npm run dev` | Dev API with watch |
| server | `npm start` | Production API |
| server | `npm run seed:admin` | Create first admin |
| client | `npm run dev` | Dev frontend |
| client | `npm run build` | Production build |

## Tech stack

- **Frontend:** Next.js 15, React 19, Tailwind CSS, Framer Motion, react-hot-toast
- **Backend:** Node.js, Express, MongoDB/Mongoose
- **Auth:** JWT, bcrypt, httpOnly cookies, rate limiting, Helmet, CORS, mongo-sanitize

## License

Private project — all rights reserved.
