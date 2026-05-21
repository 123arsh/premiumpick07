# Fix broken product images (Cloudinary + Atlas)

## Why images are broken

Your MongoDB products have URLs like:

```
http://localhost:5000/uploads/....webp
```

Browsers on **Vercel** cannot load `localhost`. Those files only existed on your PC.

**Fix:** Upload images to **Cloudinary** and save `https://res.cloudinary.com/...` URLs in Atlas.

---

## Step 1 — Cloudinary credentials (correct mapping)

From [Cloudinary Dashboard](https://console.cloudinary.com) → **API Keys**:

| Render env variable | Cloudinary dashboard |
|---------------------|----------------------|
| `CLOUDINARY_CLOUD_NAME` | **Cloud name** (e.g. `dw0y88rz4`) |
| `CLOUDINARY_API_KEY` | **API Key** column |
| `CLOUDINARY_API_SECRET` | **API Secret** (click eye to reveal) |

Do **not** swap Key and Secret. They are different values.

---

## Step 2 — Render environment (required)

Add or update on **Render → Environment**:

```env
NODE_ENV=production
UPLOAD_PROVIDER=cloudinary

CLOUDINARY_CLOUD_NAME=dw0y88rz4
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

**Manual Deploy** after saving.

In logs you should see: `Cloudinary configured: dw0y88rz4`

---

## Step 3 — Delete old products & re-add

Old products in Atlas still have `localhost` URLs. They cannot be fixed automatically.

1. Open admin: `https://premiumpick07.vercel.app/cp-x7k9m2n4p1q8`
2. **Delete** products "Autograph" and "Group" (broken images)
3. Click **+ Add product**
4. Upload image again → save

New `imageUrl` in Atlas should look like:

```
https://res.cloudinary.com/dw0y88rz4/image/upload/v1234567890/affiliate-products/xxxxx.webp
```

5. Refresh storefront — images should appear.

**Or** click **Edit** on a product and upload a **new image file** (required to replace localhost URL).

---

## Step 4 — Optional: local dev with Cloudinary

In `server/.env`:

```env
UPLOAD_PROVIDER=cloudinary
CLOUDINARY_CLOUD_NAME=dw0y88rz4
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

Then local uploads also go to Cloudinary (same as production).

---

## Verify in MongoDB Atlas

Open **Database → Browse Collections → products**.

Each product `imageUrl` must:

- Start with `https://res.cloudinary.com/`
- **Not** contain `localhost`

---

## Code behavior (after latest deploy)

- **Production (Render):** always uses Cloudinary, even if `UPLOAD_PROVIDER` is missing
- Upload errors show a clear message if Cloudinary keys are wrong
- `localhost` image URLs are rejected in production

---

## Checklist

- [ ] Cloudinary Key and Secret correct on Render (not swapped)
- [ ] `UPLOAD_PROVIDER=cloudinary` on Render
- [ ] Render redeployed, logs show "Cloudinary configured"
- [ ] Old products deleted or re-edited with new image upload
- [ ] Atlas `imageUrl` shows `res.cloudinary.com`
